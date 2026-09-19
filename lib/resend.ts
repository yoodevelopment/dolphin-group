import "server-only";
import { Resend } from "resend";
import { isEmail } from "./contact";
import type { ContactMailConfig, SendContactEmail } from "./contact-email";

export function getResendConfig(): ContactMailConfig | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  const to = process.env.CONTACT_TO_EMAIL?.trim();
  if (!apiKey || !from || !to || /[\r\n]/.test(from)) return null;
  const senderAddress = from.match(/^[^<>]+<([^<>]+)>$/)?.[1] ?? from;
  if (!isEmail(senderAddress) || !isEmail(to)) return null;
  return { apiKey, from, to };
}

export const sendContactEmail: SendContactEmail = async (config, email, idempotencyKey) => {
  // Construct only when sending: missing configuration must not break a build.
  const resend = new Resend(config.apiKey);
  // This SDK forwards request options to fetch; abort the upstream request too.
  const options = { idempotencyKey, signal: AbortSignal.timeout(12_000) };
  const { data, error } = await resend.emails.send(
    { from: config.from, to: [config.to], ...email },
    options,
  );
  if (error || !data?.id) {
    // Never return provider diagnostics, credentials, or submitted data to visitors.
    return { ok: false, retryable: !error?.statusCode || error.statusCode === 429 || error.statusCode >= 500 };
  }
  return { ok: true };
};
