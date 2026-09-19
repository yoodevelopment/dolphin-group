import { createContactHandler } from "@/lib/contact-handler";
import { getResendConfig, sendContactEmail } from "@/lib/resend";

export const runtime = "nodejs";
export const maxDuration = 30;

export const POST = createContactHandler({
  getConfig: getResendConfig,
  send: sendContactEmail,
});
