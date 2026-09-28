import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EnglishPrivacyPage from "@/app/privacy/page";
import EnglishTermsPage from "@/app/terms/page";
import { LegalPage } from "@/components/legal-page";

const locales = ["en", "ru", "es"] as const;
type Locale = (typeof locales)[number];
type LegalDocument = "privacy" | "terms";

type LegalCopy = {
  title: string;
  description: string;
  eyebrow: string;
  intro: string;
  homeLabel: string;
  version: string;
  sections: { title: string; paragraphs: string[] }[];
};

const localizedCopy: Record<
  Exclude<Locale, "en">,
  Record<LegalDocument, LegalCopy>
> = {
  ru: {
    privacy: {
      title: "Политика конфиденциальности",
      description:
        "Как обрабатываются персональные данные на сайте Dolphin Group.",
      eyebrow: "Правовая информация / Конфиденциальность",
      intro:
        "В документе описаны принципы обработки данных на сайте Dolphin Group. Если вы отправляете форму обратной связи и даёте согласие, обращение будет отправлено команде Dolphin Group по электронной почте.",
      homeLabel: "На главную",
      version:
        "Версия документа: 1 августа 2026 года. Перед коммерческим запуском владелец сайта должен проверить реквизиты компании и контактные данные.",
      sections: [
        {
          title: "Какие данные могут обрабатываться",
          paragraphs: [
            "Форма передаёт ваше имя, адрес электронной почты или номер телефона, необязательное название компании, выбранную услугу, описание проекта и указанные вами дополнительные сведения. Данные отправляются только после отправки формы с вашим согласием.",
            "Сайт не должен запрашивать специальные категории персональных данных, платёжные данные или пароли.",
          ],
        },
        {
          title: "Цель обработки",
          paragraphs: [
            "Данные используются только для ответа на обращение, уточнения задачи и обсуждения возможного проекта. Они не используются для нежелательных рекламных рассылок и не передаются третьим лицам без законного основания.",
          ],
        },
        {
          title: "Хранение и защита",
          paragraphs: [
            "Для доставки обращений на электронную почту Dolphin Group использует сервис Resend. Отправленные сведения обрабатываются почтовым сервисом и хранятся в почтовом ящике получателя. Форма не создаёт отдельную базу обращений. Не указывайте в заявке пароли, платёжные данные и другую чувствительную информацию.",
          ],
        },
        {
          title: "Ваши права",
          paragraphs: [
            "Чтобы запросить сведения об обработке данных обращения, их исправление или удаление, напишите на dolphingrouptechus@gmail.com.",
          ],
        },
      ],
    },
    terms: {
      title: "Условия использования",
      description: "Условия использования сайта Dolphin Group.",
      eyebrow: "Правовая информация / Условия",
      intro:
        "Используя сайт Dolphin Group, посетитель принимает приведённые ниже условия. Сайт предназначен для информирования и не является обязательной коммерческой офертой.",
      homeLabel: "На главную",
      version:
        "Версия документа: 1 августа 2026 года. Перед коммерческим запуском владелец сайта должен проверить реквизиты компании и контактные данные.",
      sections: [
        {
          title: "Назначение сайта",
          paragraphs: [
            "Сайт знакомит с направлениями работы Dolphin Group и позволяет отправить первичное обращение. Объём проекта, сроки и стоимость определяются после обсуждения и отдельного соглашения.",
          ],
        },
        {
          title: "Точность информации",
          paragraphs: [
            "Компания стремится поддерживать актуальность материалов сайта, но не даёт неподтверждённых гарантий результата. Упомянутые технологии и компетенции не заменяют индивидуальную оценку проекта.",
          ],
        },
        {
          title: "Интеллектуальная собственность",
          paragraphs: [
            "Тексты, композиция и визуальные материалы сайта представляют Dolphin Group. Их использование за пределами обычного просмотра требует разрешения соответствующего правообладателя.",
          ],
        },
        {
          title: "Контакты",
          paragraphs: [
            "Отправить обращение можно через форму или по адресу dolphingrouptechus@gmail.com. Отправка заявки не создаёт договор и не гарантирует объём проекта, цену или срок ответа.",
          ],
        },
      ],
    },
  },
  es: {
    privacy: {
      title: "Política de privacidad",
      description:
        "Cómo se tratan los datos personales en el sitio web de Dolphin Group.",
      eyebrow: "Información legal / Privacidad",
      intro:
        "Este documento describe los principios para tratar datos en el sitio web de Dolphin Group. Si envías el formulario de contacto y das tu consentimiento, tu consulta se enviará por correo electrónico al equipo de Dolphin Group.",
      homeLabel: "Volver al inicio",
      version:
        "Versión del documento: 1 de agosto de 2026. El propietario del sitio debe verificar los datos de la empresa y de contacto antes del lanzamiento comercial.",
      sections: [
        {
          title: "Datos que pueden tratarse",
          paragraphs: [
            "El formulario transmite tu nombre, correo electrónico o teléfono, el nombre opcional de la empresa, el servicio seleccionado, la descripción del proyecto y los datos adicionales que proporciones. Los datos solo se envían cuando envías el formulario con tu consentimiento.",
            "El sitio no debe solicitar categorías especiales de datos personales, datos de pago ni contraseñas.",
          ],
        },
        {
          title: "Finalidad del tratamiento",
          paragraphs: [
            "Los datos se utilizan únicamente para responder a una consulta, aclarar el reto y hablar de un posible proyecto. No se utilizan para marketing no solicitado ni se comparten con terceros sin una base legal.",
          ],
        },
        {
          title: "Almacenamiento y protección",
          paragraphs: [
            "El sitio utiliza Resend para enviar las consultas al correo electrónico de Dolphin Group. El servicio de correo procesa los datos enviados y los almacena en el buzón receptor. El formulario no crea una base de datos independiente de consultas. No incluyas contraseñas, datos de pago ni otra información sensible en tu solicitud.",
          ],
        },
        {
          title: "Tus derechos",
          paragraphs: [
            "Para solicitar información sobre el tratamiento de tus datos, su rectificación o eliminación, escribe a dolphingrouptechus@gmail.com.",
          ],
        },
      ],
    },
    terms: {
      title: "Términos de uso",
      description: "Términos para utilizar el sitio web de Dolphin Group.",
      eyebrow: "Información legal / Términos",
      intro:
        "Al utilizar el sitio web de Dolphin Group, el visitante acepta las condiciones siguientes. El sitio tiene fines informativos y no constituye una oferta comercial vinculante.",
      homeLabel: "Volver al inicio",
      version:
        "Versión del documento: 1 de agosto de 2026. El propietario del sitio debe verificar los datos de la empresa y de contacto antes del lanzamiento comercial.",
      sections: [
        {
          title: "Finalidad del sitio web",
          paragraphs: [
            "El sitio presenta las áreas de trabajo de Dolphin Group y permite enviar una primera consulta. El alcance, los plazos y el precio del proyecto se determinan después de hablarlo y formalizar un acuerdo independiente.",
          ],
        },
        {
          title: "Exactitud de la información",
          paragraphs: [
            "La empresa procura mantener actualizado el contenido del sitio, pero no ofrece garantías de resultados sin fundamento. Las tecnologías y capacidades mencionadas no sustituyen la evaluación individual de cada proyecto.",
          ],
        },
        {
          title: "Propiedad intelectual",
          paragraphs: [
            "Los textos, la composición y los elementos visuales de este sitio representan a Dolphin Group. Cualquier uso que exceda la consulta habitual requiere permiso del titular de los derechos correspondiente.",
          ],
        },
        {
          title: "Contacto",
          paragraphs: [
            "Puedes enviar una consulta mediante el formulario o escribir a dolphingrouptechus@gmail.com. Enviar una solicitud no crea un contrato ni garantiza un alcance, precio o plazo de respuesta.",
          ],
        },
      ],
    },
  },
};

const supportedDocuments = ["privacy", "terms"] as const;
const isLocale = (value: string): value is Locale =>
  locales.includes(value as Locale);
const isLegalDocument = (value: string): value is LegalDocument =>
  supportedDocuments.includes(value as LegalDocument);

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    supportedDocuments.map((document) => ({ locale, document })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; document: string }>;
}): Promise<Metadata> {
  const { locale, document } = await params;
  if (!isLocale(locale) || !isLegalDocument(document)) return {};
  const metadata =
    locale === "en"
      ? document === "privacy"
        ? {
            title: "Privacy Policy",
            description:
              "How personal data is handled on the Dolphin Group website.",
          }
        : {
            title: "Terms of Use",
            description: "Terms for using the Dolphin Group website.",
          }
      : localizedCopy[locale][document];
  return {
    title: metadata.title,
    description: metadata.description,
    alternates: { canonical: `/${locale}/${document}` },
  };
}

export default async function LocalizedLegalPage({
  params,
}: {
  params: Promise<{ locale: string; document: string }>;
}) {
  const { locale, document } = await params;
  if (!isLocale(locale) || !isLegalDocument(document)) notFound();
  if (locale === "en") {
    return document === "privacy" ? (
      <EnglishPrivacyPage />
    ) : (
      <EnglishTermsPage />
    );
  }

  const copy = localizedCopy[locale][document];
  return (
    <LegalPage
      eyebrow={copy.eyebrow}
      title={copy.title}
      intro={copy.intro}
      sections={copy.sections}
      homeHref={`/${locale}`}
      homeLabel={copy.homeLabel}
      version={copy.version}
    />
  );
}
