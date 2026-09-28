import { notFound } from "next/navigation";
import Home from "@/app/page";
const locales = ["en", "ru", "es"] as const;
type Locale = (typeof locales)[number];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocalizedHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  return <Home locale={locale as Locale} />;
}
