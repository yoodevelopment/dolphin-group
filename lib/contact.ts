import { services, type ServiceId } from "./services";

export type ContactFields = {
  name: string;
  contact: string;
  company: string;
  service: string;
  message: string;
  consent: boolean;
  productType: string;
  productStage: string;
  systems: string;
  agentTask: string;
  infrastructure: string;
  commercePlatform: string;
  processDescription: string;
};

export type ContactFieldErrors = Partial<Record<keyof ContactFields, string>>;

export const initialContactFields: ContactFields = {
  name: "",
  contact: "",
  company: "",
  service: "",
  message: "",
  consent: false,
  productType: "",
  productStage: "",
  systems: "",
  agentTask: "",
  infrastructure: "",
  commercePlatform: "",
  processDescription: "",
};

export type DynamicKey =
  | "productType"
  | "productStage"
  | "systems"
  | "agentTask"
  | "infrastructure"
  | "commercePlatform"
  | "processDescription";

export type DynamicFieldConfig = {
  key: DynamicKey;
  label: string;
  placeholder: string;
  error: string;
};

export function getDynamicFields(service?: ServiceId): DynamicFieldConfig[] {
  const fieldsByService: Partial<Record<ServiceId, DynamicFieldConfig[]>> = {
    mvp: [
      { key: "productType", label: "Product type", placeholder: "B2B service, customer portal, marketplace...", error: "Tell us what kind of product you are planning." },
      { key: "productStage", label: "Current stage", placeholder: "Idea, prototype, or existing product", error: "Tell us the product’s current stage." },
    ],
    crm: [{ key: "processDescription", label: "Core workflow", placeholder: "Sales, manufacturing, service, logistics...", error: "Describe the workflow for the CRM or dashboard." }],
    api: [{ key: "systems", label: "Systems to connect", placeholder: "CRM, ERP, website, payment service...", error: "List the systems you currently use." }],
    cloud: [{ key: "infrastructure", label: "Current infrastructure", placeholder: "Servers, provider, containers, constraints...", error: "Describe the current infrastructure." }],
    commerce: [{ key: "commercePlatform", label: "Current platform", placeholder: "New build, Shopify, WooCommerce, custom...", error: "Name the current or planned platform." }],
    ai: [{ key: "agentTask", label: "AI assistant task", placeholder: "Support, documents, lead qualification...", error: "Describe the future assistant’s task." }],
    growth: [{ key: "processDescription", label: "Current lead journey", placeholder: "From source to CRM and the next action", error: "Briefly describe the current process." }],
    analytics: [{ key: "systems", label: "Data sources", placeholder: "CRM, ERP, ads, spreadsheets, database...", error: "List the relevant data sources." }],
    rpa: [{ key: "processDescription", label: "Repeated process", placeholder: "Steps, systems, and common exceptions", error: "Describe the repetitive process." }],
  };

  return service ? fieldsByService[service] ?? [] : [];
}

export const CONTACT_LIMITS = {
  name: 100, contact: 254, company: 160, service: 40, message: 5000,
  productType: 500, productStage: 500, systems: 1000, agentTask: 1000,
  infrastructure: 1000, commercePlatform: 500, processDescription: 1000,
} as const;

const textKeys = Object.keys(CONTACT_LIMITS) as (keyof typeof CONTACT_LIMITS)[];
const controlCharacters = /[\u0000-\u001f\u007f]/;
const messageControlCharacters = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;

export function isEmail(value: string): boolean {
  return value.length <= CONTACT_LIMITS.contact && !controlCharacters.test(value) && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value);
}

export function validateContactFields(fields: ContactFields): ContactFieldErrors {
  const errors: ContactFieldErrors = {};
  for (const key of textKeys) {
    if (fields[key].length > CONTACT_LIMITS[key]) errors[key] = `Use no more than ${CONTACT_LIMITS[key]} characters.`;
    if ((key === "message" ? messageControlCharacters : controlCharacters).test(fields[key])) errors[key] = "Remove unsupported control characters.";
  }
  if (fields.name.trim().length < 2) errors.name = "Enter at least 2 characters.";
  const contact = fields.contact.trim();
  const digits = contact.replace(/\D/g, "").length;
  const phone = /^\+?[\d\s().-]+$/.test(contact) && digits >= 7 && digits <= 15;
  if (!isEmail(contact) && !phone) errors.contact = "Enter a valid email address or phone number.";
  const service = services.find((entry) => entry.id === fields.service);
  if (!service) errors.service = "Choose a project direction.";
  if (fields.message.trim().length < 20) errors.message = "Tell us a little more — at least 20 characters.";
  if (fields.consent !== true) errors.consent = "Consent to data processing is required.";
  if (service) for (const field of getDynamicFields(service.id)) {
    if (fields[field.key].trim().length < 2) errors[field.key] = field.error;
  }
  return errors;
}

export function parseContactPayload(value: unknown):
  | { ok: true; fields: ContactFields }
  | { ok: false; errors: ContactFieldErrors } {
  if (!value || typeof value !== "object" || Array.isArray(value)) return { ok: false, errors: { name: "Invalid request." } };
  const input = value as Record<string, unknown>;
  const fields: ContactFields = { ...initialContactFields };
  const typeErrors: ContactFieldErrors = {};
  for (const key of textKeys) {
    if (!Object.hasOwn(input, key)) continue;
    if (typeof input[key] !== "string") typeErrors[key] = "Enter text for this field.";
    else fields[key] = input[key];
  }
  fields.consent = input.consent === true;
  const errors = { ...validateContactFields(fields), ...typeErrors };
  if (Object.keys(errors).length) return { ok: false, errors };
  for (const key of textKeys) fields[key] = fields[key].trim();
  return { ok: true, fields };
}
