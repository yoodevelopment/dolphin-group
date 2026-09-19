import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms for using the Dolphin Group website.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal / Terms"
      title="Terms of Use"
      intro="By using the Dolphin Group website, a visitor accepts the terms below. The website is provided for informational purposes and does not constitute a binding commercial offer."
      sections={[
        {
          title: "Purpose of the website",
          paragraphs: [
            "The website introduces Dolphin Group’s areas of work and provides an interface for an initial inquiry. Project scope, timing, and pricing are determined only after discussion and separate agreement.",
          ],
        },
        {
          title: "Accuracy of information",
          paragraphs: [
            "The company aims to keep website content current, but does not make unsupported guarantees of results. The technologies and capabilities mentioned do not replace an individual project assessment.",
          ],
        },
        {
          title: "Intellectual property",
          paragraphs: [
            "The copy, composition, and visual elements of this website are intended to represent Dolphin Group. Use beyond ordinary viewing requires permission from the relevant rights holder.",
          ],
        },
        {
          title: "Contact",
          paragraphs: [
            "You can submit an inquiry through the contact form or email dolphingrouptechus@gmail.com. Submitting a brief does not create a contract or guarantee a project scope, price, or response time.",
          ],
        },
      ]}
    />
  );
}
