"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, type ReactNode } from "react";

export const locales = ["en", "ru", "es"] as const;
export type Locale = (typeof locales)[number];

type LocaleValue = {
  locale: Locale;
  t: (key: string, fallback: string) => string;
};
const LocaleContext = createContext<LocaleValue | null>(null);

const translations: Record<Exclude<Locale, "en">, Record<string, string>> = {
  ru: {
    "nav.services": "Услуги",
    "nav.work": "Работы",
    "nav.approach": "Подход",
    "nav.technology": "Технологии",
    "nav.company": "Компания",
    "nav.contact": "Обсудить проект",
    "language.label": "Язык",
    "language.en": "English",
    "language.ru": "Русский",
    "language.es": "Español",
    "header.home": "Dolphin Group — главная",
    "header.menu": "Открыть меню",
    "header.close": "Закрыть меню",
    "header.primary": "Основная навигация",
    "hero.eyebrow": "Цифровые продукты / ИИ / Облако",
    "hero.time": "ТАШ / UTC+5",
    "hero.title.1": "Мы соединяем бизнес",
    "hero.title.2": "с технологиями",
    "hero.title.3": "которые работают.",
    "hero.copy":
      "Создаём цифровые продукты, интеграции, ИИ и облачную инфраструктуру вокруг реальных процессов вашей команды.",
    "hero.cta": "Обсудить проект",
    "hero.services": "Посмотреть услуги",
    "services.label": "Услуги",
    "services.title.1": "От первой идеи",
    "services.title.2": "до системы",
    "services.title.3": "на которую можно опереться.",
    "services.copy":
      "Выберите задачу, чтобы увидеть подходящие направления и ожидаемый результат.",
    "work.label": "Избранные работы",
    "work.title.1": "Продуктовое мышление,",
    "work.title.2": "которое видно.",
    "work.copy":
      "Интернет-магазин Caucasian Delights. Реальный клиентский проект: от поиска продукта до адаптивного опыта покупки.",
    "why.label": "Почему Dolphin Group",
    "why.title.1": "Больше, чем код.",
    "why.title.2": "Рабочие связи",
    "why.title.3": "между процессами бизнеса.",
    "automation.label": "Автоматизация",
    "automation.title.1": "Увидьте точно,",
    "automation.title.2": "что меняется.",
    "automation.copy":
      "Без неподтверждённых процентов — только ясное сравнение пути данных и роли команды.",
    "process.label": "Процесс",
    "process.title.1": "Сначала смысл.",
    "process.title.2": "Потом система.",
    "process.copy":
      "Изучите каждый этап. Каждый заканчивается понятным артефактом для вашей команды.",
    "technology.label": "Технологии",
    "technology.title.1": "Стек следует за задачей,",
    "technology.title.2": "а не наоборот.",
    "technology.copy":
      "Выбираем технологии, которые понятны в сопровождении, надёжны в работе и готовы к следующему этапу бизнеса.",
    "demo.label": "Демо-лаборатория",
    "demo.title.1": "Интерфейс —",
    "demo.title.2": "часть объяснения.",
    "demo.copy":
      "Переключайте демо-композиции, чтобы изучить возможные механики без представления их как клиентских проектов.",
    "experience.label": "Опыт клиентов",
    "experience.title.1": "Что команда должна чувствовать",
    "experience.title.2": "на всём пути разработки.",
    "experience.copy":
      "Это стандарты совместной работы, по которым нас можно оценивать: от первого разговора до запуска.",
    "company.label": "Компания",
    "company.title.1":
      "Dolphin Group помогает бизнесу создавать цифровые продукты,",
    "company.title.2": "автоматизировать процессы",
    "company.title.3": "и соединять IT-системы.",
    "next.label": "Следующий шаг / 01",
    "next.title": "Есть задача, где системы не соединяются?",
    "next.cta": "Подобрать подходящую систему",
    "contact.label": "Контакты",
    "contact.title": "Начните с задачи.",
    "contact.copy":
      "Опишите контекст, желаемый результат и текущие ограничения. Так у нас появится полезная точка для старта.",
    "contact.flow": "Исследование → архитектура → запуск",
    "contact.system": "Одна связанная технологическая система",
    "footer.copy":
      "Цифровые продукты, интеграции, ИИ, аналитика, автоматизация и облачная инфраструктура.",
    "footer.explore": "Навигация",
    "footer.contact": "Контакты",
    "footer.documents": "Документы",
    "footer.discuss": "Обсудить проект",
    "footer.form": "Отправьте заявку через форму обратной связи.",
    "footer.privacy": "Политика конфиденциальности",
    "footer.terms": "Условия использования",
    "footer.tagline": "Цифровые системы / создано для связей",
  },
  es: {
    "nav.services": "Servicios",
    "nav.work": "Proyectos",
    "nav.approach": "Enfoque",
    "nav.technology": "Tecnología",
    "nav.company": "Empresa",
    "nav.contact": "Hablar del proyecto",
    "language.label": "Idioma",
    "language.en": "English",
    "language.ru": "Русский",
    "language.es": "Español",
    "header.home": "Dolphin Group — inicio",
    "header.menu": "Abrir menú",
    "header.close": "Cerrar menú",
    "header.primary": "Navegación principal",
    "hero.eyebrow": "Productos digitales / IA / Nube",
    "hero.time": "TAS / UTC+5",
    "hero.title.1": "Conectamos el negocio",
    "hero.title.2": "con tecnología",
    "hero.title.3": "que funciona.",
    "hero.copy":
      "Creamos productos digitales, integraciones, IA e infraestructura en la nube alrededor de los procesos reales de tu equipo.",
    "hero.cta": "Hablar del proyecto",
    "hero.services": "Ver servicios",
    "services.label": "Servicios",
    "services.title.1": "Desde la primera idea",
    "services.title.2": "hasta un sistema",
    "services.title.3": "en el que puedes confiar.",
    "services.copy":
      "Elige un reto para ver las capacidades adecuadas y el resultado esperado.",
    "work.label": "Proyectos destacados",
    "work.title.1": "Pensamiento de producto,",
    "work.title.2": "hecho visible.",
    "work.copy":
      "Una tienda online para Caucasian Delights. Un proyecto real: desde el descubrimiento del producto hasta una experiencia de compra responsive.",
    "why.label": "Por qué Dolphin Group",
    "why.title.1": "Más allá del código.",
    "why.title.2": "Conexiones que funcionan",
    "why.title.3": "en toda tu empresa.",
    "automation.label": "Automatización",
    "automation.title.1": "Ve con claridad",
    "automation.title.2": "qué cambia.",
    "automation.copy":
      "Sin porcentajes sin respaldo: solo una comparación clara del flujo de datos y del papel del equipo.",
    "process.label": "Proceso",
    "process.title.1": "Primero el sentido.",
    "process.title.2": "Después el sistema.",
    "process.copy":
      "Explora cada etapa. Todas terminan con un entregable concreto que tu equipo puede revisar y usar.",
    "technology.label": "Tecnología",
    "technology.title.1": "La tecnología sigue al problema,",
    "technology.title.2": "no al revés.",
    "technology.copy":
      "Elegimos tecnología que se pueda mantener con claridad, operar con fiabilidad y llevar a la siguiente etapa del negocio.",
    "demo.label": "Laboratorio demo",
    "demo.title.1": "La interfaz es",
    "demo.title.2": "parte de la explicación.",
    "demo.copy":
      "Cambia entre composiciones demo para explorar posibles mecánicas sin presentarlas como proyectos de clientes.",
    "experience.label": "Experiencia del cliente",
    "experience.title.1": "Lo que los equipos deben sentir",
    "experience.title.2": "durante todo el desarrollo.",
    "experience.copy":
      "Son los estándares de colaboración con los que esperamos ser evaluados, desde la primera conversación hasta el lanzamiento.",
    "company.label": "Empresa",
    "company.title.1":
      "Dolphin Group ayuda a las empresas a crear productos digitales,",
    "company.title.2": "automatizar operaciones",
    "company.title.3": "y conectar sistemas de TI.",
    "next.label": "Siguiente paso / 01",
    "next.title": "¿Tienes un reto en el que los sistemas no se conectan?",
    "next.cta": "Encontrar el sistema adecuado",
    "contact.label": "Contacto",
    "contact.title": "Empieza por el reto.",
    "contact.copy":
      "Describe el contexto, el resultado deseado y las limitaciones actuales. Así tendremos un buen punto de partida.",
    "contact.flow": "Descubrimiento → arquitectura → lanzamiento",
    "contact.system": "Un sistema tecnológico conectado",
    "footer.copy":
      "Productos digitales, integraciones, IA, analítica, automatización e infraestructura en la nube.",
    "footer.explore": "Explorar",
    "footer.contact": "Contacto",
    "footer.documents": "Documentos",
    "footer.discuss": "Hablar del proyecto",
    "footer.form": "Envía una consulta con el formulario de contacto.",
    "footer.privacy": "Política de privacidad",
    "footer.terms": "Términos de uso",
    "footer.tagline": "Sistemas digitales / creados para conectar",
  },
};

function pathWithoutLocale(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] && locales.includes(parts[0] as Locale)) parts.shift();
  return `/${parts.join("/")}`.replace(/\/$/, "") || "/";
}

export function localeHref(locale: Locale, path = "/") {
  const normalized = path === "/" ? "" : path;
  return locale === "en" ? normalized || "/" : `/${locale}${normalized}`;
}

export function translate(locale: Locale, key: string, fallback: string) {
  return locale === "en" ? fallback : (translations[locale][key] ?? fallback);
}

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return (
    <LocaleContext.Provider
      value={{
        locale,
        t: (key, fallback) => translate(locale, key, fallback),
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used within LocaleProvider");
  return context;
}

export function LanguageSwitcher() {
  const { locale, t } = useLocale();
  const pathname = usePathname();
  const currentPath = pathWithoutLocale(pathname);
  return (
    <nav
      aria-label={t("language.label", "Language")}
      className="flex min-h-11 items-center border border-line bg-white p-1 font-mono text-[10px] font-bold tracking-[0.08em] text-muted"
    >
      {locales.map((item) => (
        <Link
          key={item}
          href={localeHref(item, currentPath)}
          aria-current={locale === item ? "page" : undefined}
          className={`grid min-h-9 min-w-9 place-items-center px-2 transition-colors hover:bg-blue-50 hover:text-brand ${locale === item ? "bg-navy text-white hover:bg-navy hover:text-white" : ""}`}
        >
          {item.toUpperCase()}
          <span className="sr-only"> — {t(`language.${item}`, item)}</span>
        </Link>
      ))}
    </nav>
  );
}

Object.assign(translations.ru, {
  "project.badge": "Клиентский проект",
  "project.category": "E-commerce / продукты и напитки",
  "project.client": "Caucasian Delights",
  "project.description":
    "Интернет-магазин, объединяющий продуктовые бренды через каталог, категории и адаптивный опыт покупки.",
  "project.visit": "Открыть cdelights.com",
  "project.focus": "Фокус проекта",
  "project.capability.1": "Разработка сайта",
  "project.capability.2": "Электронная коммерция",
  "project.capability.3": "Адаптивный дизайн",
  "testimonials.label": "Отзывы клиентов",
  "testimonials.title.1": "От команд,",
  "testimonials.title.2": "с которыми мы работаем.",
  "testimonials.context.1": "Интернет-магазин",
  "testimonials.context.2": "Finance / кассовые операции и отчётность",
  "testimonials.rating": "5 из 5 звёзд",
  "form.eyebrow": "Заявка на проект / 01",
  "form.title": "Расскажите о задаче",
  "form.intro": "После отправки ваша заявка придёт нашей команде на email.",
  "form.selected": "Выбранное направление",
  "form.name": "Ваше имя",
  "form.name.placeholder": "Как к вам обращаться?",
  "form.contact": "Email или телефон",
  "form.contact.placeholder": "name@company.com или +1...",
  "form.company": "Компания",
  "form.company.placeholder": "Название компании или отрасль",
  "form.service": "Направление проекта",
  "form.message": "Контекст проекта",
  "form.message.placeholder":
    "Что нужно сделать, почему это важно сейчас и как будет выглядеть хороший результат?",
  "form.consent": "Я согласен(на) на обработку данных в соответствии с",
  "form.privacy": "политикой конфиденциальности",
  "form.submit": "Отправить заявку",
  "form.sending": "Отправляем...",
  "form.reply": "Ответим по указанным контактам.",
  "form.success":
    "Заявка отправлена. Спасибо — наша команда свяжется с вами по указанным данным.",
  "form.failed":
    "Не удалось подтвердить отправку. Данные остались в форме — попробуйте ещё раз позже.",
  "form.retry":
    "Не удалось подтвердить отправку. Данные остались в форме — повторите ту же заявку через минуту.",
  "form.limited":
    "Слишком много попыток. Подождите несколько минут и попробуйте снова.",
  "form.consent.error": "Необходимо согласие на обработку данных.",
  "form.reload": "Обновите форму и попробуйте ещё раз.",
  "form.honeypot": "Оставьте это поле пустым",
  "form.brief": "Детали заявки",
});
Object.assign(translations.es, {
  "project.badge": "Proyecto de cliente",
  "project.category": "E-commerce / alimentación y bebidas",
  "project.client": "Caucasian Delights",
  "project.description":
    "Una tienda online que reúne marcas de alimentación y bebidas mediante catálogo, categorías y una experiencia de compra responsive.",
  "project.visit": "Visitar cdelights.com",
  "project.focus": "Enfoque del proyecto",
  "project.capability.1": "Desarrollo web",
  "project.capability.2": "Comercio electrónico",
  "project.capability.3": "Diseño responsive",
  "testimonials.label": "Opiniones de clientes",
  "testimonials.title.1": "De los equipos",
  "testimonials.title.2": "con los que construimos.",
  "testimonials.context.1": "Sitio web de e-commerce",
  "testimonials.context.2": "Finance / operaciones de caja e informes",
  "testimonials.rating": "5 de 5 estrellas",
  "form.eyebrow": "Resumen del proyecto / 01",
  "form.title": "Cuéntanos el reto",
  "form.intro": "Tu consulta llegará a nuestro equipo por email al enviarla.",
  "form.selected": "Dirección seleccionada",
  "form.name": "Tu nombre",
  "form.name.placeholder": "¿Cómo deberíamos llamarte?",
  "form.contact": "Email o teléfono",
  "form.contact.placeholder": "nombre@empresa.com o +1...",
  "form.company": "Empresa",
  "form.company.placeholder": "Nombre de la empresa o sector",
  "form.service": "Dirección del proyecto",
  "form.message": "Contexto del proyecto",
  "form.message.placeholder":
    "¿Qué necesita hacerse, por qué importa ahora y cómo sería un buen resultado?",
  "form.consent": "Acepto el tratamiento de datos conforme a la",
  "form.privacy": "política de privacidad",
  "form.submit": "Enviar resumen",
  "form.sending": "Enviando...",
  "form.reply": "Responderemos usando los datos de contacto que facilites.",
  "form.success":
    "Tu consulta fue enviada. Gracias: nuestro equipo se pondrá en contacto contigo.",
  "form.failed":
    "No pudimos confirmar el envío. Tus datos siguen en el formulario; inténtalo de nuevo más tarde.",
  "form.retry":
    "No pudimos confirmar el envío. Tus datos siguen en el formulario; vuelve a intentar la misma consulta en un momento.",
  "form.limited":
    "Demasiadas solicitudes. Espera unos minutos antes de volver a intentarlo.",
  "form.consent.error": "Es necesario aceptar el tratamiento de datos.",
  "form.reload": "Vuelve a cargar el formulario e inténtalo de nuevo.",
  "form.honeypot": "Deja este campo vacío",
  "form.brief": "Detalles del proyecto",
});

Object.assign(translations.ru, {
  "hero.solution": "Подобрать решение",
  "hero.track.1": "Продукт",
  "hero.track.2": "Системы",
  "hero.track.3": "Автоматизация",
  "solution.label": "Подбор решения",
  "solution.title.1": "Что должна система",
  "solution.title.2": "изменить для вас?",
  "solution.copy":
    "Выберите задачу бизнеса. Мы покажем связанный путь без выдуманных цен и сроков.",
  "why.item.1.title": "Одна зона ответственности",
  "why.item.1.copy":
    "Продукт, интеграции, данные, ИИ и облако согласованы в одной команде.",
  "why.item.2.title": "Архитектура до масштаба",
  "why.item.2.copy":
    "Рано определяем связи и ограничения, чтобы быстрый старт не стал тупиком.",
  "why.item.3.title": "Язык задачи",
  "why.item.3.copy":
    "Объясняем решения через процессы, риски и влияние на команду — без лишнего технического шума.",
  "why.item.4.title": "Видимые итерации",
  "why.item.4.copy":
    "Регулярно показываем рабочий результат и вносим изменения, пока они не стали дорогими.",
  "why.track.1": "Идея",
  "why.track.2": "Продукт",
  "why.track.3": "Система",
  "why.track.4": "Масштаб",
  "experience.item.1.audience": "Для основателей",
  "experience.item.1.title": "Ясные вводные до решения.",
  "experience.item.1.copy":
    "Объём, компромиссы и следующие решения видны от исследования до запуска.",
  "experience.item.2.audience": "Для продуктовых команд",
  "experience.item.2.title": "Рабочий продукт остаётся в диалоге.",
  "experience.item.2.copy":
    "Регулярные демонстрации делают обратную связь конкретной, пока изменения ещё доступны.",
  "experience.item.3.audience": "Для операционных команд",
  "experience.item.3.title": "Важен весь процесс.",
  "experience.item.3.copy":
    "Интерфейсы, интеграции, состояния данных и обработка исключений проектируются как одна система.",
  "company.item.1.title": "Смотреть дальше интерфейса",
  "company.item.1.copy":
    "Учитывать данные, роли, внешние сервисы и операции — всё, что определяет работу продукта на практике.",
  "company.item.2.title": "Убирать лишнюю сложность",
  "company.item.2.copy":
    "Выбирать понятные решения и объяснять компромиссы, чтобы команда уверенно управляла системой.",
  "company.item.3.title": "Проектировать следующий этап",
  "company.item.3.copy":
    "Создавать первую версию так, чтобы будущие функции и интеграции не требовали начать всё заново.",
  "footer.top": "Dolphin Group — наверх",
  "footer.navigation": "Навигация в подвале",
  "form.service.choose": "Выберите услугу",
  "service.challenge": "Задача",
  "service.deliverable": "Результат",
  "service.cta": "Обсудить эту услугу",
  "service.mvp.title": "MVP и веб-продукты",
  "service.mvp.problem":
    "Идея должна стать продуктом, который пользователи могут оценить, а команда — проверить в реальных сценариях.",
  "service.crm.title": "Индивидуальные панели и CRM",
  "service.crm.problem":
    "Команда принимает решения в таблицах и разрозненных инструментах, без чёткого представления о текущей работе.",
  "service.api.title": "API-интеграции",
  "service.api.problem":
    "Данные дублируются, переносятся вручную или теряются на границе между сервисами.",
  "service.cloud.title": "Переезд в облако",
  "service.cloud.problem":
    "Текущая инфраструктура ограничивает рост, тяжела в поддержке и делает работу под нагрузкой непредсказуемой.",
  "service.commerce.title": "E-commerce-платформы",
  "service.commerce.problem":
    "Пользователям сложно выбрать товар и оформить покупку, а данные интернет-магазина остаются разрозненными с внутренними системами.",
  "service.ai.title": "ИИ-агенты и ассистенты",
  "service.ai.problem":
    "Команда повторяет одну и ту же рутинную работу и теряет время на поиск контекста в разных системах.",
  "service.growth.title": "Автоматизация маркетинга и продаж",
  "service.growth.problem":
    "Лиды проходят воронку вручную, коммуникация идёт неравномерно, а атрибуция остаётся неясной.",
  "service.analytics.title": "Аналитика данных",
  "service.analytics.problem":
    "Метрики собираются слишком долго, расходятся в инструментах или не отвечают на вопросы руководства.",
  "service.rpa.title": "RPA и автоматизация процессов",
  "service.rpa.problem":
    "Люди повторяют предсказуемые последовательности помогающих действий в документах и бизнес-системах.",
  "finder.aria": "Задачи бизнеса",
  "finder.recommended": "Рекомендуемая система",
  "finder.cta": "Обсудить эту задачу",
  "finder.launch.label": "Запустить новый продукт",
  "finder.launch.note":
    "Определить первую версию, интеграционный слой и среду для запуска.",
  "finder.automate.label": "Автоматизировать процесс",
  "finder.automate.note":
    "Найти повторяющуюся работу и превратить её в контролируемый, наблюдаемый поток.",
  "finder.connect.label": "Связать бизнес-системы",
  "finder.connect.note":
    "Спроектировать обмен данными, обработку сбоев и операционную прозрачность.",
  "finder.dashboard.label": "Создать CRM или панель",
  "finder.dashboard.note":
    "Построить интерфейс вокруг решений, ролей и данных команды.",
  "finder.agent.label": "Внедрить ИИ",
  "finder.agent.note":
    "Определить роль ассистента, надёжные источники и границы действий.",
  "finder.migrate.label": "Перенести систему в облако",
  "finder.migrate.note":
    "Подготовить миграцию, окружения и устойчивую модель эксплуатации.",
  "finder.shop.label": "Создать e-commerce-платформу",
  "finder.shop.note":
    "Связать каталог, оформление заказа, оплату, доставку и работу с заказами.",
  "process.aria": "Этапы работы",
  "process.stage": "Этап",
  "process.output": "Результат этапа",
  "process.next": "Следующий этап",
  "process.discovery.title": "Исследование",
  "process.discovery.description":
    "Понять контекст бизнеса, пользователей, ограничения и критерии готовности.",
  "process.discovery.output": "Карта задачи и границы проекта",
  "process.design.title": "Проектирование",
  "process.design.description":
    "Определить процессы, архитектуру, модель данных и границы интеграций.",
  "process.design.output": "Прототип и технический план",
  "process.build.title": "Разработка",
  "process.build.description":
    "Работать короткими итерациями и регулярно показывать рабочую версию.",
  "process.build.output": "Тестируемые части продукта",
  "process.validation.title": "Проверка",
  "process.validation.description":
    "Проверить основные и граничные сценарии для данных, безопасности, доступности и стабильности.",
  "process.validation.output": "Система, готовая к релизу",
  "process.launch.title": "Запуск",
  "process.launch.description":
    "Подготовить окружения, документацию, миграции и контролируемый выход в продакшен.",
  "process.launch.output": "Рабочий продукт в продакшене",
  "process.support.title": "Поддержка",
  "process.support.description":
    "Наблюдать за системой, разбирать сигналы и планировать развитие по приоритетам.",
  "process.support.output": "План развития продукта и операций",
  "demo.eyebrow": "Демо-интерфейсы / не клиентские работы",
  "demo.aria": "Демо-интерфейсы",
  "demo.note":
    "Эти интерфейсы показывают возможную механику. Они не представлены как работы клиентов.",
  "demo.interactive": "Интерактивное демо",
  "demo.crm.label": "CRM-панель",
  "demo.crm.copy":
    "Воронка, сигналы и рабочие состояния в одном операционном представлении.",
  "demo.ai.label": "ИИ-агент",
  "demo.ai.copy":
    "Диалог на основе источников, контекста и видимых вызовов инструментов.",
  "demo.api.label": "API-слой",
  "demo.api.copy":
    "Связи сервисов, единый шлюз и наблюдаемые состояния обмена.",
  "demo.analytics.label": "Аналитический отчёт",
  "demo.analytics.copy":
    "Метрики, изменения и сигналы вокруг управленческого вопроса.",
});
Object.assign(translations.es, {
  "hero.solution": "Encontrar tu solución",
  "hero.track.1": "Producto",
  "hero.track.2": "Sistemas",
  "hero.track.3": "Automatización",
  "solution.label": "Buscador de soluciones",
  "solution.title.1": "¿Qué debería el sistema",
  "solution.title.2": "cambiar para ti?",
  "solution.copy":
    "Elige el reto de negocio. Mostraremos una ruta de servicios conectada, sin precios ni plazos inventados.",
  "why.item.1.title": "Una sola responsabilidad",
  "why.item.1.copy":
    "Producto, integraciones, datos, IA y nube se mantienen alineados dentro de un solo equipo.",
  "why.item.2.title": "Arquitectura antes de escalar",
  "why.item.2.copy":
    "Trazamos conexiones y limitaciones desde el principio para que un inicio rápido no se convierta en un callejón sin salida.",
  "why.item.3.title": "El lenguaje del problema",
  "why.item.3.copy":
    "Explicamos decisiones mediante flujos, riesgos e impacto en el equipo, sin ruido técnico innecesario.",
  "why.item.4.title": "Iteraciones visibles",
  "why.item.4.copy":
    "Mostramos resultados funcionales durante el trabajo y ajustamos antes de que los cambios se vuelvan costosos.",
  "why.track.1": "Idea",
  "why.track.2": "Producto",
  "why.track.3": "Sistema",
  "why.track.4": "Escala",
  "experience.item.1.audience": "Para fundadores",
  "experience.item.1.title": "Suposiciones claras antes de decidir.",
  "experience.item.1.copy":
    "Alcance, decisiones y próximos pasos permanecen visibles desde el descubrimiento hasta el lanzamiento.",
  "experience.item.2.audience": "Para equipos de producto",
  "experience.item.2.title": "El software funcional sigue en la conversación.",
  "experience.item.2.copy":
    "Las demostraciones regulares hacen que el feedback sea concreto mientras los cambios siguen siendo asequibles.",
  "experience.item.3.audience": "Para equipos operativos",
  "experience.item.3.title": "Todo el flujo importa.",
  "experience.item.3.copy":
    "Interfaces, integraciones, estados de datos y manejo de excepciones se diseñan como un solo sistema.",
  "company.item.1.title": "Mirar más allá de la interfaz",
  "company.item.1.copy":
    "Considerar datos, roles, servicios externos y operaciones: todo lo que determina cómo funciona el producto en la práctica.",
  "company.item.2.title": "Eliminar complejidad evitable",
  "company.item.2.copy":
    "Elegir soluciones comprensibles y explicar decisiones para que el equipo gestione el sistema con confianza.",
  "company.item.3.title": "Construir para la siguiente etapa",
  "company.item.3.copy":
    "Diseñar la primera versión para que futuras funciones e integraciones no requieran empezar de cero.",
  "footer.top": "Dolphin Group — volver arriba",
  "footer.navigation": "Navegación del pie",
  "form.service.choose": "Elige un servicio",
  "service.challenge": "Reto",
  "service.deliverable": "Entregable",
  "service.cta": "Hablar de este servicio",
  "service.mvp.title": "MVP y productos web",
  "service.mvp.problem":
    "Una idea debe convertirse en un producto que los usuarios puedan experimentar y el equipo pueda validar en escenarios reales.",
  "service.crm.title": "Paneles y CRM a medida",
  "service.crm.problem":
    "El equipo toma decisiones con hojas de cálculo y herramientas aisladas, sin una visión clara del trabajo actual.",
  "service.api.title": "Integraciones API",
  "service.api.problem":
    "Los datos se duplican, se mueven manualmente o se pierden en los límites entre servicios.",
  "service.cloud.title": "Migración a la nube",
  "service.cloud.problem":
    "La infraestructura actual limita el crecimiento, es difícil de mantener y hace impredecible la carga de trabajo.",
  "service.commerce.title": "Plataformas e-commerce",
  "service.commerce.problem":
    "Los clientes tienen dificultades para elegir y pagar, mientras los datos de la tienda siguen desconectados de los sistemas internos.",
  "service.ai.title": "Agentes y asistentes de IA",
  "service.ai.problem":
    "Los equipos repiten el mismo trabajo de conocimiento y pierden tiempo buscando contexto entre sistemas.",
  "service.growth.title": "Automatización de marketing y ventas",
  "service.growth.problem":
    "Los leads avanzan por el embudo manualmente, la comunicación es inconsistente y la atribución sigue poco clara.",
  "service.analytics.title": "Analítica de datos",
  "service.analytics.problem":
    "Las métricas tardan demasiado en reunirse, se contradicen entre herramientas o no responden a las preguntas de dirección.",
  "service.rpa.title": "RPA y automatización de procesos",
  "service.rpa.problem":
    "Las personas repiten secuencias predecibles de acciones entre documentos y sistemas de negocio.",
  "finder.aria": "Objetivos de negocio",
  "finder.recommended": "Sistema recomendado",
  "finder.cta": "Hablar de este reto",
  "finder.launch.label": "Lanzar un producto nuevo",
  "finder.launch.note":
    "Definir la primera versión, su capa de integración y el entorno necesario para lanzarla.",
  "finder.automate.label": "Automatizar un proceso",
  "finder.automate.note":
    "Encontrar el trabajo repetitivo y convertirlo en un flujo controlado y observable.",
  "finder.connect.label": "Conectar sistemas de negocio",
  "finder.connect.note":
    "Diseñar el intercambio de datos, la gestión de fallos y la visibilidad operativa.",
  "finder.dashboard.label": "Crear un CRM o panel",
  "finder.dashboard.note":
    "Crear una interfaz basada en las decisiones, roles y datos del equipo.",
  "finder.agent.label": "Introducir IA",
  "finder.agent.note":
    "Definir el papel del asistente, las fuentes fiables y los límites de acción.",
  "finder.migrate.label": "Llevar un sistema a la nube",
  "finder.migrate.note":
    "Preparar la migración, los entornos y un modelo operativo sostenible.",
  "finder.shop.label": "Crear una plataforma e-commerce",
  "finder.shop.note":
    "Conectar catálogo, compra, pagos, entrega y operación de pedidos.",
  "process.aria": "Etapas de entrega",
  "process.stage": "Etapa",
  "process.output": "Resultado de la etapa",
  "process.next": "Siguiente etapa",
  "process.discovery.title": "Descubrimiento",
  "process.discovery.description":
    "Comprender el contexto de negocio, usuarios, limitaciones y definición de terminado.",
  "process.discovery.output": "Mapa del reto y límites del proyecto",
  "process.design.title": "Diseño",
  "process.design.description":
    "Definir flujos, arquitectura, modelo de datos y límites de integración.",
  "process.design.output": "Prototipo y plan técnico",
  "process.build.title": "Desarrollo",
  "process.build.description":
    "Trabajar en iteraciones concretas y mostrar con frecuencia una versión funcional.",
  "process.build.output": "Incrementos de producto comprobables",
  "process.validation.title": "Validación",
  "process.validation.description":
    "Probar casos principales y límite para datos, seguridad, accesibilidad y estabilidad.",
  "process.validation.output": "Un sistema listo para lanzar",
  "process.launch.title": "Lanzamiento",
  "process.launch.description":
    "Preparar entornos, documentación, migraciones y una salida controlada a producción.",
  "process.launch.output": "Un producto funcionando en producción",
  "process.support.title": "Soporte",
  "process.support.description":
    "Observar el sistema, investigar señales y planificar el desarrollo según prioridades.",
  "process.support.output": "Hoja de ruta de producto y operaciones",
  "demo.eyebrow": "Interfaces demo / no son trabajo de clientes",
  "demo.aria": "Interfaces demo",
  "demo.note":
    "Estas interfaces explican posibles mecánicas. No se presentan como trabajo de clientes.",
  "demo.interactive": "Demo interactiva",
  "demo.crm.label": "Panel CRM",
  "demo.crm.copy":
    "Pipeline, señales y estados de trabajo en una vista operativa.",
  "demo.ai.label": "Agente de IA",
  "demo.ai.copy":
    "Una conversación basada en fuentes, contexto y llamadas de herramientas visibles.",
  "demo.api.label": "Capa API",
  "demo.api.copy":
    "Conexiones de servicio, una puerta de enlace central y estados de intercambio observables.",
  "demo.analytics.label": "Informe analítico",
  "demo.analytics.copy":
    "Métricas, cambios y señales organizados alrededor de una pregunta de gestión.",
});

Object.assign(translations.ru, {
  "automation.eyebrow": "Автоматизация / сравнение",
  "automation.title": "Один процесс. Два состояния.",
  "automation.copy2":
    "Переключайте вид, чтобы увидеть, как меняются связи и ответственность команды.",
  "automation.aria": "Состояние процесса",
  "automation.before": "До",
  "automation.after": "После",
  "automation.before.label": "До автоматизации",
  "automation.before.eyebrow": "Ручной процесс",
  "automation.after.label": "После автоматизации",
  "automation.after.eyebrow": "Связанный процесс",
  "ecosystem.eyebrow": "Экосистема / интерактивно",
  "ecosystem.active": "Система активна",
  "ecosystem.aria": "Интерактивная карта цифровой экосистемы Dolphin Group",
  "ecosystem.node.active": "активно",
  "ecosystem.web": "Веб-приложение",
  "ecosystem.web.copy": "Интерфейс продукта для клиентов и внутренних команд.",
  "ecosystem.crm.copy":
    "Операционные состояния, ответственность и следующие действия.",
  "ecosystem.api.copy": "Общий слой обмена, связывающий все бизнес-системы.",
  "ecosystem.cloud.copy":
    "Среда для запуска, хранения и масштабирования продукта.",
  "ecosystem.ai.copy":
    "Ассистент, работающий с надёжным контекстом и системами.",
  "ecosystem.analytics.copy":
    "Понятные сигналы и отчёты для уверенных решений.",
  "technology.product": "Продукт",
  "technology.systems": "Системы",
  "technology.infrastructure": "Инфраструктура",
  "technology.intelligence": "Интеллект",
  "technology.product.copy": "Веб-приложения и интерфейсы, готовые к развитию.",
  "technology.systems.copy": "API, данные и надёжные связи между сервисами.",
  "technology.infrastructure.copy":
    "Облачные среды для запуска, работы и масштабирования.",
  "technology.intelligence.copy":
    "ИИ, аналитика и автоматизация повторяющейся работы.",
});
Object.assign(translations.es, {
  "automation.eyebrow": "Automatización / comparar",
  "automation.title": "Un proceso. Dos estados.",
  "automation.copy2":
    "Cambia la vista para ver cómo cambian las conexiones y las responsabilidades del equipo.",
  "automation.aria": "Estado del proceso",
  "automation.before": "Antes",
  "automation.after": "Después",
  "automation.before.label": "Antes de automatizar",
  "automation.before.eyebrow": "Flujo manual",
  "automation.after.label": "Después de automatizar",
  "automation.after.eyebrow": "Flujo conectado",
  "ecosystem.eyebrow": "Ecosistema / interactivo",
  "ecosystem.active": "Sistema activo",
  "ecosystem.aria": "Mapa interactivo del ecosistema digital de Dolphin Group",
  "ecosystem.node.active": "activo",
  "ecosystem.web": "Aplicación web",
  "ecosystem.web.copy":
    "Una interfaz de producto para clientes y equipos internos.",
  "ecosystem.crm.copy":
    "Estados operativos, responsabilidades y próximas acciones.",
  "ecosystem.api.copy":
    "Una capa compartida que conecta todos los sistemas de negocio.",
  "ecosystem.cloud.copy":
    "El entorno para ejecutar, almacenar y escalar el producto.",
  "ecosystem.ai.copy":
    "Un asistente que trabaja con contexto y sistemas de confianza.",
  "ecosystem.analytics.copy":
    "Señales e informes claros para decisiones con confianza.",
  "technology.product": "Producto",
  "technology.systems": "Sistemas",
  "technology.infrastructure": "Infraestructura",
  "technology.intelligence": "Inteligencia",
  "technology.product.copy":
    "Aplicaciones web e interfaces diseñadas para evolucionar.",
  "technology.systems.copy":
    "APIs, datos y conexiones fiables entre servicios.",
  "technology.infrastructure.copy":
    "Entornos en la nube para lanzamiento, operación y escala.",
  "technology.intelligence.copy":
    "IA, analítica y automatización para trabajo repetitivo.",
});

Object.assign(translations.ru, {
  "testimonials.author.2": "Владелец бизнеса / предприниматель",
  "testimonials.quote.1":
    "Они создали современный, удобный и профессиональный интернет-магазин, который хорошо представляет наш бренд. Особенно мы ценим внимание к деталям, общение и готовность вносить изменения на протяжении проекта. Итог превзошёл наши ожидания.",
  "testimonials.quote.2":
    "Теперь мы можем управлять кассовыми операциями, отслеживать финансовую активность и гораздо быстрее и эффективнее формировать отчёты. Система проста в использовании, экономит команде значительное количество времени и даёт гораздо более ясное представление о наших финансах.",
  "ecosystem.crm": "CRM",
  "ecosystem.api": "API",
  "ecosystem.cloud": "Облако",
  "ecosystem.ai": "ИИ",
  "ecosystem.analytics": "Аналитика",
  "ecosystem.summary":
    "Веб-приложение, CRM, облако, ИИ и аналитика связаны общим API-слоем Dolphin Group.",
  "automation.before.item.1.title": "Ручной приём заявок",
  "automation.before.item.1.detail":
    "Менеджер читает каждое обращение и направляет его дальше.",
  "automation.before.item.2.title": "Повторный ввод данных",
  "automation.before.item.2.detail":
    "Информацию копируют между формами, таблицами и CRM.",
  "automation.before.item.3.title": "Подготовка отчётов",
  "automation.before.item.3.detail":
    "Показатели вручную собирают из нескольких источников.",
  "automation.before.item.4.title": "Повторные напоминания",
  "automation.before.item.4.detail":
    "Следующее действие зависит от памяти и загрузки коллеги.",
  "automation.after.item.1.title": "Автоматическая маршрутизация",
  "automation.after.item.1.detail":
    "Каждое обращение попадает в нужный процесс и к ответственному.",
  "automation.after.item.2.title": "Синхронизация CRM",
  "automation.after.item.2.detail":
    "Записи и статусы обновляются по заданным правилам.",
  "automation.after.item.3.title": "Актуальная отчётность",
  "automation.after.item.3.detail":
    "Данные собраны в общем актуальном представлении.",
  "automation.after.item.4.title": "Оповещения и помощь ИИ",
  "automation.after.item.4.detail":
    "Система показывает контекст и запускает следующий шаг.",
  "service.mvp.short": "MVP или веб-продукт",
  "service.mvp.marker": "Запуск",
  "service.mvp.result":
    "Рабочая первая версия с понятным планом дальнейшего развития.",
  "service.mvp.include.1": "Исследование и объём",
  "service.mvp.include.2": "UX-прототип",
  "service.mvp.include.3": "Разработка первой версии",
  "service.mvp.include.4": "Подготовка к запуску",
  "service.crm.short": "CRM или панель",
  "service.crm.marker": "Работа",
  "service.crm.result":
    "Рабочий интерфейс, построенный вокруг реальных процессов компании.",
  "service.crm.include.1": "Процессы с учётом ролей",
  "service.crm.include.2": "Воронки и статусы",
  "service.crm.include.3": "Фильтры и отчёты",
  "service.crm.include.4": "Интеграции с источниками",
  "service.api.short": "API-интеграция",
  "service.api.marker": "Связи",
  "service.api.result":
    "Документированный интеграционный слой с наблюдаемыми состояниями и сбоями.",
  "service.api.include.1": "Карта систем",
  "service.api.include.2": "Контракты API",
  "service.api.include.3": "Вебхуки и очереди",
  "service.api.include.4": "Мониторинг ошибок",
  "service.cloud.short": "Облачная инфраструктура",
  "service.cloud.marker": "Масштаб",
  "service.cloud.result":
    "Управляемая облачная среда с документированной моделью эксплуатации.",
  "service.cloud.include.1": "Аудит окружения",
  "service.cloud.include.2": "План миграции",
  "service.cloud.include.3": "Контейнеризация",
  "service.cloud.include.4": "CI/CD и наблюдаемость",
  "service.commerce.short": "E-commerce-платформа",
  "service.commerce.marker": "Торговля",
  "service.commerce.result":
    "Связанный процесс торговли: от выбора товара до обработки заказа.",
  "service.commerce.include.1": "Каталог и поиск",
  "service.commerce.include.2": "Корзина и оформление заказа",
  "service.commerce.include.3": "Оплата и доставка",
  "service.commerce.include.4": "Склад и CRM",
  "service.ai.short": "ИИ-агент",
  "service.ai.marker": "Интеллект",
  "service.ai.result":
    "ИИ-ассистент с определённой ролью, надёжными источниками и чёткими границами действий.",
  "service.ai.include.1": "Сценарии агента",
  "service.ai.include.2": "База знаний и RAG",
  "service.ai.include.3": "Интеграции с системами",
  "service.ai.include.4": "Контроль качества",
  "service.growth.short": "Автоматизация маркетинга и продаж",
  "service.growth.marker": "Рост",
  "service.growth.result":
    "Наблюдаемый автоматизированный поток от первого обращения до следующего действия.",
  "service.growth.include.1": "Маршрутизация лидов",
  "service.growth.include.2": "Автоматические сценарии",
  "service.growth.include.3": "Синхронизация CRM",
  "service.growth.include.4": "Сквозная аналитика",
  "service.analytics.short": "Аналитика данных",
  "service.analytics.marker": "Решения",
  "service.analytics.result":
    "Общий слой отчётности с прозрачными правилами расчёта.",
  "service.analytics.include.1": "Модель показателей",
  "service.analytics.include.2": "Подключение источников",
  "service.analytics.include.3": "Визуализация",
  "service.analytics.include.4": "Роли и регулярные отчёты",
  "service.rpa.short": "Автоматизация RPA",
  "service.rpa.marker": "Автоматизация",
  "service.rpa.result":
    "Автоматизированная последовательность с контролем и прозрачностью на каждом шаге.",
  "service.rpa.include.1": "Карта процесса",
  "service.rpa.include.2": "Сценарии автоматизации",
  "service.rpa.include.3": "Обработка исключений",
  "service.rpa.include.4": "Журнал выполнения",
  "field.productType.label": "Тип продукта",
  "field.productType.placeholder":
    "B2B-сервис, клиентский портал, маркетплейс...",
  "field.productType.error": "Расскажите, какой продукт вы планируете.",
  "field.productStage.label": "Текущий этап",
  "field.productStage.placeholder": "Идея, прототип или действующий продукт",
  "field.productStage.error": "Расскажите о текущем этапе продукта.",
  "field.processDescription.label": "Основной процесс",
  "field.processDescription.placeholder":
    "Продажи, производство, сервис, логистика...",
  "field.processDescription.error": "Опишите процесс для CRM или панели.",
  "field.systems.label": "Какие системы связать",
  "field.systems.placeholder": "CRM, ERP, сайт, платёжный сервис...",
  "field.systems.error": "Перечислите системы, которыми вы пользуетесь.",
  "field.infrastructure.label": "Текущая инфраструктура",
  "field.infrastructure.placeholder":
    "Серверы, провайдер, контейнеры, ограничения...",
  "field.infrastructure.error": "Опишите текущую инфраструктуру.",
  "field.commercePlatform.label": "Текущая платформа",
  "field.commercePlatform.placeholder":
    "Новая разработка, Shopify, WooCommerce, своя платформа...",
  "field.commercePlatform.error": "Укажите текущую или планируемую платформу.",
  "field.agentTask.label": "Задача ИИ-ассистента",
  "field.agentTask.placeholder": "Поддержка, документы, квалификация лидов...",
  "field.agentTask.error": "Опишите задачу будущего ассистента.",
  "form.error.maxLength": "Используйте не более {count} символов.",
  "form.error.controlCharacters": "Удалите недопустимые управляющие символы.",
  "form.error.minLength": "Введите не менее 2 символов.",
  "form.error.contact": "Введите корректный email или номер телефона.",
  "form.error.service": "Выберите направление проекта.",
  "form.error.message": "Расскажите подробнее — не менее 20 символов.",
  "form.error.consent": "Необходимо согласие на обработку данных.",
  "form.error.invalidRequest": "Некорректный запрос.",
  "form.error.textRequired": "Введите текст в это поле.",
});

Object.assign(translations.es, {
  "testimonials.author.2": "Propietario de negocio / emprendedor",
  "testimonials.quote.1":
    "Crearon una tienda online moderna, fácil de usar y profesional que representa muy bien nuestra marca. Valoramos especialmente su atención al detalle, la comunicación y la disposición para realizar ajustes durante el proyecto. El resultado final superó nuestras expectativas.",
  "testimonials.quote.2":
    "Ahora podemos gestionar las operaciones de caja, seguir la actividad financiera y generar informes con mucha más rapidez y eficiencia. El sistema es fácil de usar, ahorra bastante tiempo al equipo y nos ofrece una visión mucho más clara de nuestras finanzas.",
  "ecosystem.crm": "CRM",
  "ecosystem.api": "API",
  "ecosystem.cloud": "Nube",
  "ecosystem.ai": "IA",
  "ecosystem.analytics": "Analítica",
  "ecosystem.summary":
    "La aplicación web, el CRM, la nube, la IA y la analítica se conectan mediante una capa API compartida de Dolphin Group.",
  "automation.before.item.1.title": "Recepción manual",
  "automation.before.item.1.detail":
    "Una persona lee cada consulta y la asigna a quien corresponde.",
  "automation.before.item.2.title": "Entrada repetida de datos",
  "automation.before.item.2.detail":
    "La información se copia entre formularios, hojas de cálculo y CRM.",
  "automation.before.item.3.title": "Preparación de informes",
  "automation.before.item.3.detail":
    "Los indicadores se recopilan manualmente de varias fuentes.",
  "automation.before.item.4.title": "Seguimiento repetido",
  "automation.before.item.4.detail":
    "El siguiente paso depende de la memoria y la carga de un compañero.",
  "automation.after.item.1.title": "Asignación automática",
  "automation.after.item.1.detail":
    "Cada consulta entra en el flujo adecuado y llega a la persona responsable.",
  "automation.after.item.2.title": "Sincronización del CRM",
  "automation.after.item.2.detail":
    "Los registros y estados se actualizan según reglas definidas.",
  "automation.after.item.3.title": "Informes actualizados",
  "automation.after.item.3.detail":
    "Los datos se reúnen en una vista compartida y actualizada.",
  "automation.after.item.4.title": "Alertas y asistencia de IA",
  "automation.after.item.4.detail":
    "El sistema muestra contexto y activa el siguiente paso.",
  "service.mvp.short": "MVP o producto web",
  "service.mvp.marker": "Lanzamiento",
  "service.mvp.result":
    "Una primera versión funcional con una ruta clara para seguir desarrollándola.",
  "service.mvp.include.1": "Descubrimiento y alcance",
  "service.mvp.include.2": "Prototipo UX",
  "service.mvp.include.3": "Desarrollo de la primera versión",
  "service.mvp.include.4": "Preparación del lanzamiento",
  "service.crm.short": "CRM o panel",
  "service.crm.marker": "Operaciones",
  "service.crm.result":
    "Una interfaz operativa basada en la forma real de trabajar de la empresa.",
  "service.crm.include.1": "Flujos por rol",
  "service.crm.include.2": "Embudo y estados",
  "service.crm.include.3": "Filtros e informes",
  "service.crm.include.4": "Integraciones de fuentes",
  "service.api.short": "Integración API",
  "service.api.marker": "Conexión",
  "service.api.result":
    "Una capa de integración documentada con estados y errores observables.",
  "service.api.include.1": "Mapa de sistemas",
  "service.api.include.2": "Contratos API",
  "service.api.include.3": "Webhooks y colas",
  "service.api.include.4": "Monitorización de errores",
  "service.cloud.short": "Infraestructura cloud",
  "service.cloud.marker": "Escala",
  "service.cloud.result":
    "Un entorno cloud gestionable con un modelo operativo documentado.",
  "service.cloud.include.1": "Auditoría del entorno",
  "service.cloud.include.2": "Plan de migración",
  "service.cloud.include.3": "Contenedorización",
  "service.cloud.include.4": "CI/CD y observabilidad",
  "service.commerce.short": "Plataforma e-commerce",
  "service.commerce.marker": "Comercio",
  "service.commerce.result":
    "Un flujo de comercio conectado, desde descubrir productos hasta gestionar pedidos.",
  "service.commerce.include.1": "Catálogo y búsqueda",
  "service.commerce.include.2": "Carrito y pago",
  "service.commerce.include.3": "Pagos y entrega",
  "service.commerce.include.4": "Inventario y CRM",
  "service.ai.short": "Agente de IA",
  "service.ai.marker": "Inteligencia",
  "service.ai.result":
    "Un asistente de IA con una función definida, fuentes fiables y límites de acción explícitos.",
  "service.ai.include.1": "Escenarios del agente",
  "service.ai.include.2": "Base de conocimiento y RAG",
  "service.ai.include.3": "Integraciones de sistemas",
  "service.ai.include.4": "Controles de calidad",
  "service.growth.short": "Automatización de marketing y ventas",
  "service.growth.marker": "Crecimiento",
  "service.growth.result":
    "Un flujo automatizado y observable desde la primera consulta hasta la siguiente acción.",
  "service.growth.include.1": "Asignación de leads",
  "service.growth.include.2": "Flujos activados",
  "service.growth.include.3": "Sincronización del CRM",
  "service.growth.include.4": "Analítica integral",
  "service.analytics.short": "Analítica de datos",
  "service.analytics.marker": "Decisiones",
  "service.analytics.result":
    "Una capa de informes compartida con reglas de cálculo transparentes.",
  "service.analytics.include.1": "Modelo de indicadores",
  "service.analytics.include.2": "Conexión de fuentes",
  "service.analytics.include.3": "Visualización",
  "service.analytics.include.4": "Roles e informes programados",
  "service.rpa.short": "Automatización RPA",
  "service.rpa.marker": "Automatización",
  "service.rpa.result":
    "Una secuencia automatizada con control y visibilidad en cada paso.",
  "service.rpa.include.1": "Mapa del proceso",
  "service.rpa.include.2": "Escenarios de automatización",
  "service.rpa.include.3": "Gestión de excepciones",
  "service.rpa.include.4": "Registro de ejecución",
  "field.productType.label": "Tipo de producto",
  "field.productType.placeholder":
    "Servicio B2B, portal de clientes, marketplace...",
  "field.productType.error":
    "Cuéntanos qué tipo de producto estás planificando.",
  "field.productStage.label": "Etapa actual",
  "field.productStage.placeholder": "Idea, prototipo o producto existente",
  "field.productStage.error": "Cuéntanos en qué etapa está el producto.",
  "field.processDescription.label": "Flujo principal",
  "field.processDescription.placeholder":
    "Ventas, fabricación, servicio, logística...",
  "field.processDescription.error": "Describe el flujo del CRM o panel.",
  "field.systems.label": "Sistemas que conectar",
  "field.systems.placeholder": "CRM, ERP, sitio web, servicio de pagos...",
  "field.systems.error": "Enumera los sistemas que utilizáis actualmente.",
  "field.infrastructure.label": "Infraestructura actual",
  "field.infrastructure.placeholder":
    "Servidores, proveedor, contenedores, limitaciones...",
  "field.infrastructure.error": "Describe la infraestructura actual.",
  "field.commercePlatform.label": "Plataforma actual",
  "field.commercePlatform.placeholder":
    "Nuevo desarrollo, Shopify, WooCommerce, plataforma propia...",
  "field.commercePlatform.error": "Indica la plataforma actual o prevista.",
  "field.agentTask.label": "Tarea del asistente de IA",
  "field.agentTask.placeholder":
    "Soporte, documentos, cualificación de leads...",
  "field.agentTask.error": "Describe la tarea del futuro asistente.",
  "form.error.maxLength": "Usa como máximo {count} caracteres.",
  "form.error.controlCharacters":
    "Elimina los caracteres de control no permitidos.",
  "form.error.minLength": "Introduce al menos 2 caracteres.",
  "form.error.contact": "Introduce un email o teléfono válido.",
  "form.error.service": "Elige una dirección para el proyecto.",
  "form.error.message": "Cuéntanos un poco más: al menos 20 caracteres.",
  "form.error.consent": "Es necesario aceptar el tratamiento de datos.",
  "form.error.invalidRequest": "Solicitud no válida.",
  "form.error.textRequired": "Introduce texto en este campo.",
});

Object.assign(translations.ru, {
  "project.newTab": " (открывается в новой вкладке)",
  "visual.mvp.window": "Продукт / Спринт 04",
  "visual.mvp.workspace": "Рабочее пространство",
  "visual.mvp.backlog": "План",
  "visual.mvp.build": "Разработка",
  "visual.mvp.ready": "Готово",
  "visual.crm.window": "CRM / Воронка",
  "visual.crm.new": "Новые",
  "visual.crm.progress": "В работе",
  "visual.crm.nextAction": "Следующий шаг",
  "visual.crm.activity": "Активность",
  "visual.crm.lead": "Лид",
  "visual.crm.call": "Звонок",
  "visual.crm.brief": "Заявка",
  "visual.crm.scope": "Объём",
  "visual.api.gateway": "Шлюз",
  "visual.cloud.region": "Регион облака",
  "visual.status.active": "активно",
  "visual.status.ready": "ГОТОВО",
  "visual.status.queued": "в очереди",
  "visual.status.notified": "уведомлён",
  "visual.status.synced": "синхронизировано",
  "visual.status.done": "готово",
  "visual.status.next": "далее",
  "visual.store.title": "Магазин",
  "visual.store.checkout": "Оформление заказа",
  "visual.store.order": "Заказ",
  "visual.store.item": "Товар",
  "visual.store.delivery": "Доставка",
  "visual.store.payment": "Оплата",
  "visual.ai.agent": "ИИ-агент",
  "visual.ai.knowledge": "База знаний",
  "visual.ai.prompt": "Собери контекст обращения и предложи следующий шаг.",
  "visual.ai.response": "Агент / ответ",
  "visual.ai.answer":
    "Найден нужный контекст в CRM и базе знаний. Подготовлены сводка и сценарий согласования.",
  "visual.ai.completed": "Вызов инструмента завершён",
  "visual.growth.form": "Форма",
  "visual.growth.score": "Оценка",
  "visual.growth.crm": "CRM",
  "visual.growth.action": "Действие",
  "visual.growth.lead": "Лид",
  "visual.growth.route": "МАРШРУТ",
  "visual.growth.email": "Письмо",
  "visual.growth.manager": "Менеджер",
  "visual.growth.report": "Отчёт",
  "visual.analytics.title": "Аналитика",
  "visual.analytics.weekly": "За неделю",
  "visual.analytics.pipeline": "Воронка",
  "visual.analytics.tasks": "Задачи",
  "visual.analytics.signals": "Сигналы",
  "visual.rpa.read": "Прочитать обращение",
  "visual.rpa.update": "Обновить CRM",
  "visual.rpa.create": "Создать документ",
  "visual.rpa.notify": "Отправить уведомление",
});

Object.assign(translations.es, {
  "project.newTab": " (se abre en una pestaña nueva)",
  "visual.mvp.window": "Producto / Sprint 04",
  "visual.mvp.workspace": "Espacio de trabajo",
  "visual.mvp.backlog": "Pendiente",
  "visual.mvp.build": "Desarrollo",
  "visual.mvp.ready": "Listo",
  "visual.crm.window": "CRM / Embudo",
  "visual.crm.new": "Nuevos",
  "visual.crm.progress": "En curso",
  "visual.crm.nextAction": "Siguiente paso",
  "visual.crm.activity": "Actividad",
  "visual.crm.lead": "Lead",
  "visual.crm.call": "Llamada",
  "visual.crm.brief": "Solicitud",
  "visual.crm.scope": "Alcance",
  "visual.api.gateway": "Pasarela",
  "visual.cloud.region": "Región cloud",
  "visual.status.active": "activo",
  "visual.status.ready": "LISTO",
  "visual.status.queued": "en cola",
  "visual.status.notified": "notificado",
  "visual.status.synced": "sincronizado",
  "visual.status.done": "hecho",
  "visual.status.next": "siguiente",
  "visual.store.title": "Tienda",
  "visual.store.checkout": "Pago",
  "visual.store.order": "Pedido",
  "visual.store.item": "Artículo",
  "visual.store.delivery": "Entrega",
  "visual.store.payment": "Pago",
  "visual.ai.agent": "Agente de IA",
  "visual.ai.knowledge": "Conocimiento",
  "visual.ai.prompt":
    "Reúne el contexto de la consulta y propone el siguiente paso.",
  "visual.ai.response": "Agente / respuesta",
  "visual.ai.answer":
    "Se encontró contexto útil en el CRM y la base de conocimiento. Se prepararon un resumen y una ruta de aprobación.",
  "visual.ai.completed": "Llamada a herramienta completada",
  "visual.growth.form": "Formulario",
  "visual.growth.score": "Puntuación",
  "visual.growth.crm": "CRM",
  "visual.growth.action": "Acción",
  "visual.growth.lead": "Lead",
  "visual.growth.route": "RUTA",
  "visual.growth.email": "Email",
  "visual.growth.manager": "Responsable",
  "visual.growth.report": "Informe",
  "visual.analytics.title": "Analítica",
  "visual.analytics.weekly": "Semanal",
  "visual.analytics.pipeline": "Embudo",
  "visual.analytics.tasks": "Tareas",
  "visual.analytics.signals": "Señales",
  "visual.rpa.read": "Leer solicitud",
  "visual.rpa.update": "Actualizar CRM",
  "visual.rpa.create": "Crear documento",
  "visual.rpa.notify": "Enviar notificación",
});
