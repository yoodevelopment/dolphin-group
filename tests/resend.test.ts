import assert from "node:assert/strict";
import { test } from "node:test";
import { sendContactEmail } from "../lib/resend";

test("Resend SDK forwards the timeout, fixed recipient and idempotency key; rejects failed acceptance", async () => {
  const originalFetch = globalThis.fetch;
  const config = { apiKey: "re_test_fake", from: "Site <site@example.com>", to: "team@example.com" };
  const email = { subject: "Test", text: "Test brief", replyTo: "visitor@example.com" };
  let mode = "success";
  globalThis.fetch = async (input, options) => {
    assert.equal(String(input), "https://api.resend.com/emails");
    assert.equal(new Headers(options?.headers).get("Idempotency-Key"), "test-idempotency");
    assert.ok(options?.signal instanceof AbortSignal);
    const body = JSON.parse(String(options?.body));
    assert.deepEqual(body.to, ["team@example.com"]);
    assert.equal(body.reply_to, "visitor@example.com");
    if (mode === "throw") throw new Error("private upstream detail");
    return Response.json(mode === "success" ? { id: "email-id" } : {}, { status: 200 });
  };
  try {
    assert.deepEqual(await sendContactEmail(config, email, "test-idempotency"), { ok: true });
    mode = "missing-id";
    assert.deepEqual(await sendContactEmail(config, email, "test-idempotency"), { ok: false, retryable: true });
    mode = "throw";
    assert.deepEqual(await sendContactEmail(config, email, "test-idempotency"), { ok: false, retryable: true });
  } finally { globalThis.fetch = originalFetch; }
});
