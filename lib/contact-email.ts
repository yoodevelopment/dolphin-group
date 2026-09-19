import { getDynamicFields, isEmail, type ContactFields } from "./contact";
import { services } from "./services";

export type ContactMailConfig = { apiKey: string; from: string; to: string };
export type ContactEmail = { subject: string; text: string; replyTo?: string };
export type SendContactEmail = (
  config: ContactMailConfig,
  email: ContactEmail,
  idempotencyKey: string,
) => Promise<{ ok: true } | { ok: false; retryable: boolean }>;

export function buildContactEmail(fields: ContactFields): ContactEmail {
  const service = services.find((entry) => entry.id === fields.service)!;
  const details = getDynamicFields(service.id).map(
    (field) => `${field.label}: ${fields[field.key]}`,
  );

  return {
    subject: `New project brief — ${service.shortTitle}`,
    text: [
      "New inquiry from the Dolphin Group website",
      "",
      `Name: ${fields.name}`,
      `Contact: ${fields.contact}`,
      `Company: ${fields.company || "Not provided"}`,
      `Project direction: ${service.shortTitle}`,
      ...details,
      "",
      "Project context:",
      fields.message,
      "",
      "The visitor agreed to the website privacy policy.",
    ].join("\n"),
    ...(isEmail(fields.contact) ? { replyTo: fields.contact } : {}),
  };
}
