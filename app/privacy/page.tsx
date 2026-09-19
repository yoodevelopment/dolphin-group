import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How personal data is handled on the Dolphin Group website.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal / Privacy"
      title="Privacy Policy"
      intro="This document outlines the principles for handling data on the Dolphin Group website. When you submit the contact form with your consent, your inquiry is sent to the Dolphin Group team by email."
      sections={[
        {
          title: "Data that may be processed",
          paragraphs: [
            "The form transmits your name, email address or phone number, optional company name, selected service, project description, and any service-specific details you enter. Data is sent only when you submit the form with your consent.",
            "The website should not request special categories of personal data, payment details, or passwords.",
          ],
        },
        {
          title: "Purpose of processing",
          paragraphs: [
            "Data is used only to respond to an inquiry, clarify the challenge, and discuss a potential project. It should not be used for unsolicited marketing or shared with third parties without a lawful basis.",
          ],
        },
        {
          title: "Storage and protection",
          paragraphs: [
            "The website uses Resend to deliver inquiries to the Dolphin Group email inbox. Submitted details are processed by the email service and stored in the receiving mailbox. The contact form does not create a separate database of inquiries. Do not include passwords, payment details, or other sensitive information in your brief.",
          ],
        },
        {
          title: "Your rights",
          paragraphs: [
            "To request information about processing, correction, or deletion of inquiry data, contact dolphingrouptechus@gmail.com.",
          ],
        },
      ]}
    />
  );
}
