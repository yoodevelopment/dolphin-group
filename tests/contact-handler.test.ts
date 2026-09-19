import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { createContactHandler } from "../lib/contact-handler";
import type { ContactEmail, ContactMailConfig } from "../lib/contact-email";

const config: ContactMailConfig = { apiKey: "test-key", from: "Dolphin Group <website@example.com>", to: "team@example.com" };
const valid = () => ({ name: "Test Visitor", contact: "visitor@example.com", company: "Example", service: "commerce", commercePlatform: "New store", message: "Please help us build a product catalog and online store.", consent: true, website: "", requestId: randomUUID() });
function request(body: unknown, headers: Record<string, string> = {}) {
  return new Request("https://website.example/api/send", { method: "POST", headers: { Origin: "https://website.example", "Content-Type": "application/json", ...headers }, body: typeof body === "string" ? body : JSON.stringify(body) });
}
function setup() {
  const sent: { email: ContactEmail; key: string; to: string }[] = [];
  const handler = createContactHandler({ getConfig: () => config, send: async (settings, email, key) => { sent.push({ email, key, to: settings.to }); return { ok: true }; } });
  return { handler, sent };
}

test("sends only to server-configured recipient, with a visitor reply-to and selected details", async () => {
  const { handler, sent } = setup();
  const response = await handler(request({ ...valid(), to: "attacker@example.com", from: "attacker@example.com", systems: "inactive private detail" }));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { sent: true });
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(sent[0].to, config.to);
  assert.equal(sent[0].email.replyTo, "visitor@example.com");
  assert.match(sent[0].email.text, /Current platform: New store/);
  assert.doesNotMatch(sent[0].email.text, /inactive private detail/);
});

test("does not set reply-to for a phone number or interpret submitted HTML", async () => {
  const { handler, sent } = setup();
  const response = await handler(request({ ...valid(), contact: "+998 (90) 123-45-67", message: "<img src=x onerror=alert(1)> Please call us about a store." }));
  assert.equal(response.status, 200);
  assert.equal(sent[0].email.replyTo, undefined);
  assert.ok(!("html" in sent[0].email));
  assert.match(sent[0].email.text, /<img/);
});

test("rejects invalid JSON, missing consent, invalid service and filled honeypot before sending", async () => {
  const { handler, sent } = setup();
  for (const body of ["{", null, [], { ...valid(), consent: "true" }, { ...valid(), service: "constructor" }, { ...valid(), website: "spam" }, { ...valid(), requestId: "bad" }]) {
    assert.equal((await handler(request(body))).status, 400);
  }
  assert.equal(sent.length, 0);
});

test("rejects foreign origins and unsupported content types", async () => {
  const { handler, sent } = setup();
  assert.equal((await handler(request(valid(), { Origin: "https://attacker.example" }))).status, 403);
  assert.equal((await handler(request(valid(), { Origin: "" }))).status, 403);
  assert.equal((await handler(request(valid(), { "Sec-Fetch-Site": "cross-site" }))).status, 403);
  assert.equal((await handler(request(valid(), { "Content-Type": "text/plain" }))).status, 415);
  assert.equal(sent.length, 0);
});

test("enforces body size even without a content-length header", async () => {
  const { handler, sent } = setup();
  assert.equal((await handler(request({ ...valid(), message: "x".repeat(25_000) }))).status, 413);
  assert.equal((await handler(request(valid(), { "Content-Length": "999999" }))).status, 413);
  assert.equal(sent.length, 0);
});

test("returns unavailable without configuration and never attempts delivery", async () => {
  const handler = createContactHandler({ getConfig: () => null, send: async () => { throw new Error("must not call"); } });
  assert.equal((await handler(request(valid()))).status, 503);
});

test("provider rejection or exception cannot produce false success or leak diagnostics", async () => {
  for (const mode of ["permanent", "temporary", "exception"]) {
    const handler = createContactHandler({ getConfig: () => config, send: async () => { if (mode === "exception") throw new Error("secret-and-private-contact"); return { ok: false, retryable: mode === "temporary" }; } });
    const response = await handler(request(valid()));
    assert.equal(response.status, mode === "permanent" ? 503 : 502);
    const body = await response.text();
    assert.doesNotMatch(body, /secret-and-private-contact|sent.*true|test-key/);
  }
});

test("retries of unchanged payload have the same provider idempotency key", async () => {
  const { handler, sent } = setup();
  const body = valid();
  await handler(request(body));
  await handler(request(body));
  await handler(request({ ...body, message: "A different brief that needs another project discussion." }));
  assert.equal(sent[0].key, sent[1].key);
  assert.notEqual(sent[1].key, sent[2].key);
});

test("limits repeated contact submissions and reopens the window", async () => {
  let time = 100;
  let sends = 0;
  const handler = createContactHandler({ getConfig: () => config, now: () => time, send: async () => { sends++; return { ok: true }; } });
  for (let i = 0; i < 5; i++) assert.equal((await handler(request(valid()))).status, 200);
  const limited = await handler(request(valid()));
  assert.equal(limited.status, 429);
  assert.equal(limited.headers.get("retry-after"), "600");
  assert.equal(sends, 5);
  time += 600_001;
  assert.equal((await handler(request(valid()))).status, 200);
});

test("caps total sends per process even if the sender changes their contact", async () => {
  const { handler, sent } = setup();
  for (let i = 0; i < 30; i++) assert.equal((await handler(request({ ...valid(), contact: `visitor${i}@example.com` }))).status, 200);
  assert.equal((await handler(request(valid()))).status, 429);
  assert.equal(sent.length, 30);
});

test("accepts the browser origin when Next exposes a different internal hostname", async () => {
  const { handler, sent } = setup();
  const response = await handler(request(valid(), { Host: "127.0.0.1:3000", Origin: "http://127.0.0.1:3000" }));
  assert.equal(response.status, 200);
  assert.equal(sent.length, 1);
});
