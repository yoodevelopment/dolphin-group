import { createHash } from "node:crypto";
import { parseContactPayload } from "./contact";
import { buildContactEmail, type ContactMailConfig, type SendContactEmail } from "./contact-email";

const MAX_BODY_BYTES = 24 * 1024;
const WINDOW_MS = 10 * 60 * 1000;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function json(body: unknown, status: number, headers: Record<string, string> = {}) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

async function readBody(request: Request): Promise<unknown> {
  if (Number(request.headers.get("content-length")) > MAX_BODY_BYTES) throw new RangeError();
  if (!request.body) throw new SyntaxError();
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new RangeError();
      }
      chunks.push(value);
    }
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } finally {
    reader.releaseLock();
  }
}

export function createContactHandler({
  getConfig,
  send,
  now = Date.now,
}: {
  getConfig: () => ContactMailConfig | null;
  send: SendContactEmail;
  now?: () => number;
}) {
  // Bounded, per-process protection. Add a shared gateway/WAF limit when scaling.
  const attempts = new Map<string, { count: number; expires: number }>();
  let globalWindow = { count: 0, expires: 0 };

  return async function handleContact(request: Request): Promise<Response> {
    const origin = request.headers.get("origin");
    const allowedOrigins = new Set([new URL(request.url).origin]);
    // Next.js may expose an internal hostname in request.url behind a proxy.
    // Compare the browser origin with the actual HTTP Host as well.
    if (origin) {
      try {
        const browserOrigin = new URL(origin);
        if (["http:", "https:"].includes(browserOrigin.protocol) && browserOrigin.host === request.headers.get("host")) {
          allowedOrigins.add(browserOrigin.origin);
        }
      } catch { /* Malformed origins are rejected below. */ }
    }
    if (process.env.NEXT_PUBLIC_SITE_URL) {
      try { allowedOrigins.add(new URL(process.env.NEXT_PUBLIC_SITE_URL).origin); } catch { /* Invalid SEO config does not disable a local form. */ }
    }
    if (!origin || !allowedOrigins.has(origin) || request.headers.get("sec-fetch-site") === "cross-site") {
      return json({ error: "This request is not allowed." }, 403);
    }
    if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
      return json({ error: "Send a JSON request." }, 415);
    }

    let value: unknown;
    try { value = await readBody(request); } catch (error) {
      return json({ error: error instanceof RangeError ? "The request is too large." : "Invalid request." }, error instanceof RangeError ? 413 : 400);
    }
    if (!value || typeof value !== "object" || Array.isArray(value)) return json({ error: "Invalid request." }, 400);
    const input = value as Record<string, unknown>;
    if (typeof input.website !== "string" || input.website !== "" || typeof input.requestId !== "string" || !UUID.test(input.requestId)) {
      return json({ error: "Please reload the form and try again." }, 400);
    }
    const parsed = parseContactPayload(input);
    if (!parsed.ok) return json({ error: "Check the highlighted fields.", errors: parsed.errors }, 400);

    const config = getConfig();
    if (!config) return json({ error: "The contact service is temporarily unavailable. Please try again later." }, 503);
    const time = now();
    for (const [key, entry] of attempts) if (entry.expires <= time) attempts.delete(key);
    if (globalWindow.expires <= time) globalWindow = { count: 0, expires: time + WINDOW_MS };
    const identity = createHash("sha256").update(parsed.fields.contact.toLowerCase()).digest("hex");
    const limit = attempts.get(identity) ?? { count: 0, expires: time + WINDOW_MS };
    if (limit.count >= 5 || globalWindow.count >= 30) {
      const expires = limit.count >= 5 ? limit.expires : globalWindow.expires;
      return json({ error: "Too many requests. Please wait a few minutes before trying again." }, 429, { "Retry-After": String(Math.max(1, Math.ceil((expires - time) / 1000))) });
    }
    limit.count++;
    attempts.set(identity, limit);
    globalWindow.count++;

    const email = buildContactEmail(parsed.fields);
    const digest = createHash("sha256").update(JSON.stringify({ from: config.from, to: config.to, ...email })).digest("hex");
    try {
      const result = await send(config, email, `contact/${input.requestId}/${digest}`);
      if (!result.ok) return json({ error: "We could not send the brief. Please try again later." }, result.retryable ? 502 : 503);
      return json({ sent: true }, 200);
    } catch {
      return json({ error: "We could not confirm sending. Please retry the same brief in a moment." }, 502);
    }
  };
}
