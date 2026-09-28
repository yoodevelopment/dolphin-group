"use client";

import { AlertCircle, ArrowRight, Check, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { SERVICE_INTENT_EVENT } from "@/lib/service-intent";
import { serviceById, services, type ServiceId } from "@/lib/services";
import {
  CONTACT_LIMITS,
  getDynamicFields,
  initialContactFields as initialFields,
  validateContactFields as validate,
  type ContactFields as FormFields,
  type ContactFieldErrors as FieldErrors,
  type DynamicFieldConfig,
} from "@/lib/contact";
import { localeHref, useLocale } from "@/lib/i18n";

type SubmitStatus = "idle" | "loading" | "success" | "error";

const inputClassName =
  "min-h-12 w-full border-0 border-b bg-transparent px-0 py-3 text-base font-semibold text-ink outline-none transition-colors placeholder:font-normal placeholder:text-slate-400 focus:border-brand focus:ring-0";

export function ContactForm() {
  const { t, locale } = useLocale();
  const [fields, setFields] = useState<FormFields>(initialFields);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");

  const [statusMessage, setStatusMessage] = useState("");
  const [website, setWebsite] = useState("");
  const sending = useRef(false);
  const submission = useRef<{ payload: string; id: string } | null>(null);

  const localizeError = (error: string | undefined, fieldKey?: string) => {
    if (!error) return undefined;
    if (fieldKey) {
      const translatedFieldError = t(`field.${fieldKey}.error`, error);
      if (translatedFieldError !== error) return translatedFieldError;
    }
    const lengthError = error.match(/^Use no more than (\d+) characters\.$/);
    if (lengthError) {
      return t(
        "form.error.maxLength",
        "Use no more than {count} characters.",
      ).replace("{count}", lengthError[1]);
    }
    const errorKeys: Record<string, string> = {
      "Remove unsupported control characters.": "form.error.controlCharacters",
      "Enter at least 2 characters.": "form.error.minLength",
      "Enter a valid email address or phone number.": "form.error.contact",
      "Choose a project direction.": "form.error.service",
      "Tell us a little more — at least 20 characters.": "form.error.message",
      "Consent to data processing is required.": "form.error.consent",
      "Invalid request.": "form.error.invalidRequest",
      "Enter text for this field.": "form.error.textRequired",
    };
    const translationKey = errorKeys[error];
    return translationKey ? t(translationKey, error) : error;
  };

  useEffect(() => {
    const handleServiceIntent = (event: Event) => {
      const customEvent = event as CustomEvent<{ service: ServiceId }>;
      if (
        sending.current ||
        !services.some((service) => service.id === customEvent.detail?.service)
      )
        return;
      setFields((current) => ({
        ...current,
        service: customEvent.detail.service,
      }));
      setErrors((current) => ({ ...current, service: undefined }));
      setStatus("idle");
    };

    window.addEventListener(SERVICE_INTENT_EVENT, handleServiceIntent);
    return () =>
      window.removeEventListener(SERVICE_INTENT_EVENT, handleServiceIntent);
  }, []);

  const updateField = <Key extends keyof FormFields>(
    key: Key,
    value: FormFields[Key],
  ) => {
    if (sending.current) return;
    setFields((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    if (status !== "idle") setStatus("idle");
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;
    const nextErrors = validate(fields);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      const firstKey = Object.keys(nextErrors)[0] as keyof FormFields;
      const fieldIds: Partial<Record<keyof FormFields, string>> = {
        name: "name",
        contact: "contact-value",
        company: "company",
        service: "service",
        message: "message",
      };
      const selector =
        firstKey === "consent"
          ? '[name="consent"]'
          : `#${fieldIds[firstKey] ?? `extra-${firstKey}`}`;
      const firstInvalid =
        event.currentTarget.querySelector<HTMLElement>(selector);
      firstInvalid?.focus();
      return;
    }

    const payload = JSON.stringify(fields);
    if (submission.current?.payload !== payload) {
      submission.current = { payload, id: crypto.randomUUID() };
    }
    sending.current = true;
    setStatus("loading");
    setStatusMessage("");

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...fields,
          website,
          requestId: submission.current.id,
        }),
        signal: AbortSignal.timeout(20_000),
      });
      const result = await response.json();
      if (!response.ok || result?.sent !== true) {
        if (response.status === 400 && result?.errors) setErrors(result.errors);
        setStatusMessage(
          response.status === 429
            ? t(
                "form.limited",
                "Too many requests. Please wait a few minutes before trying again.",
              )
            : t(
                "form.failed",
                "We could not confirm sending. Your details remain in the form — please try again later.",
              ),
        );
        setStatus("error");
        return;
      }
      setStatus("success");
      setFields(initialFields);
      submission.current = null;
      setWebsite("");
    } catch {
      setStatusMessage(
        t(
          "form.retry",
          "We could not confirm sending. Your details remain in the form — please retry the same brief in a moment.",
        ),
      );
      setStatus("error");
    } finally {
      sending.current = false;
    }
  }

  return (
    <form
      className="bg-white p-5 sm:p-8 lg:p-10"
      noValidate
      aria-busy={status === "loading"}
      onSubmit={handleSubmit}
    >
      <div className="mb-8 flex flex-col gap-3 border-b pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand">
            {t("form.eyebrow", "Project brief / 01")}
          </span>
          <h3 className="mt-2 text-2xl font-extrabold tracking-[-0.05em] text-ink sm:text-3xl">
            {t("form.title", "Tell us about the challenge")}
          </h3>
        </div>
        <span className="max-w-[240px] text-xs leading-5 text-muted">
          {t(
            "form.intro",
            "Your brief is emailed to our team when you submit this form.",
          )}
        </span>
      </div>

      {fields.service && Object.hasOwn(serviceById, fields.service) ? (
        <div className="mb-7 flex items-center justify-between border border-blue-200 bg-blue-50 p-3 text-sm">
          <span className="text-muted">
            {t("form.selected", "Selected direction")}
          </span>
          <strong className="text-brand">
            {t(
              `service.${fields.service}.short`,
              serviceById[fields.service as ServiceId].shortTitle,
            )}
          </strong>
        </div>
      ) : null}

      <div className="hidden" aria-hidden="true">
        <label htmlFor="contact-website">
          {t("form.honeypot", "Leave this field empty")}
        </label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          maxLength={200}
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
      </div>
      <fieldset
        disabled={status === "loading"}
        className="min-w-0 border-0 p-0"
      >
        <legend className="sr-only">
          {t("form.brief", "Project brief details")}
        </legend>
        <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
          <Field
            id="name"
            label={t("form.name", "Your name")}
            error={localizeError(errors.name, "name")}
          >
            <input
              id="name"
              name="name"
              maxLength={CONTACT_LIMITS.name}
              type="text"
              autoComplete="name"
              className={inputClassName}
              placeholder={t(
                "form.name.placeholder",
                "How should we address you?",
              )}
              value={fields.name}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "name-error" : undefined}
              onChange={(event) => updateField("name", event.target.value)}
            />
          </Field>

          <Field
            id="contact"
            label={t("form.contact", "Email or phone")}
            error={localizeError(errors.contact, "contact")}
          >
            <input
              id="contact-value"
              name="contact"
              maxLength={CONTACT_LIMITS.contact}
              type="text"
              autoComplete="email"
              inputMode="email"
              className={inputClassName}
              placeholder={t(
                "form.contact.placeholder",
                "name@company.com or +1...",
              )}
              value={fields.contact}
              aria-invalid={Boolean(errors.contact)}
              aria-describedby={errors.contact ? "contact-error" : undefined}
              onChange={(event) => updateField("contact", event.target.value)}
            />
          </Field>

          <Field
            id="company"
            label={t("form.company", "Company")}
            error={localizeError(errors.company, "company")}
          >
            <input
              id="company"
              name="company"
              maxLength={CONTACT_LIMITS.company}
              type="text"
              autoComplete="organization"
              className={inputClassName}
              placeholder={t(
                "form.company.placeholder",
                "Company name or industry",
              )}
              value={fields.company}
              aria-describedby={errors.company ? "company-error" : undefined}
              aria-invalid={Boolean(errors.company)}
              onChange={(event) => updateField("company", event.target.value)}
            />
          </Field>

          <Field
            id="service"
            label={t("form.service", "Project direction")}
            error={localizeError(errors.service, "service")}
          >
            <select
              id="service"
              name="service"
              className={inputClassName}
              value={fields.service}
              aria-invalid={Boolean(errors.service)}
              aria-describedby={errors.service ? "service-error" : undefined}
              onChange={(event) => updateField("service", event.target.value)}
            >
              <option value="">
                {t("form.service.choose", "Choose a service")}
              </option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {t(`service.${service.id}.short`, service.shortTitle)}
                </option>
              ))}
            </select>
          </Field>

          {getDynamicFields(fields.service as ServiceId)
            .map((field) => ({
              ...field,
              label: t("field." + field.key + ".label", field.label),
              placeholder: t(
                "field." + field.key + ".placeholder",
                field.placeholder,
              ),
              error: t("field." + field.key + ".error", field.error),
            }))
            .map((field) => (
              <DynamicInput
                key={field.key}
                field={field}
                value={fields[field.key]}
                error={localizeError(errors[field.key], field.key)}
                onChange={(value) => updateField(field.key, value)}
              />
            ))}

          <div className="sm:col-span-2">
            <Field
              id="message"
              label={t("form.message", "Project context")}
              error={localizeError(errors.message, "message")}
            >
              <textarea
                id="message"
                name="message"
                maxLength={CONTACT_LIMITS.message}
                rows={4}
                className={`${inputClassName} resize-y`}
                placeholder={t(
                  "form.message.placeholder",
                  "What do you need to build, connect, or automate?",
                )}
                value={fields.message}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? "message-error" : undefined}
                onChange={(event) => updateField("message", event.target.value)}
              />
            </Field>
          </div>
        </div>

        <label className="mt-7 flex cursor-pointer items-start gap-3 text-sm leading-6 text-muted">
          <input
            type="checkbox"
            name="consent"
            className="mt-1 size-5 shrink-0 accent-brand"
            checked={fields.consent}
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? "consent-error" : undefined}
            onChange={(event) => updateField("consent", event.target.checked)}
          />
          <span>
            {t(
              "form.consent",
              "I agree to data processing in accordance with the",
            )}{" "}
            <Link
              href={localeHref(locale, "/privacy")}
              className="font-semibold text-ink underline decoration-slate-300 underline-offset-4 hover:text-brand"
            >
              {t("form.privacy", "privacy policy")}
            </Link>
            .
          </span>
        </label>
        {errors.consent ? (
          <p
            id="consent-error"
            className="mt-2 text-sm font-semibold text-danger"
          >
            {localizeError(errors.consent, "consent")}
          </p>
        ) : null}
      </fieldset>

      <div className="mt-8 flex flex-col gap-4 border-t pt-7 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={status === "loading"}
          className="group flex min-h-14 items-center justify-between gap-8 bg-brand px-5 text-left font-bold text-white transition-colors hover:bg-brand-deep disabled:cursor-wait disabled:opacity-70 sm:min-w-[240px]"
        >
          {status === "loading"
            ? t("form.sending", "Sending...")
            : t("form.submit", "Send project brief")}
          {status === "loading" ? (
            <LoaderCircle className="animate-spin" aria-hidden="true" />
          ) : (
            <ArrowRight
              className="transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          )}
        </button>
        <span className="text-xs leading-5 text-muted">
          {t(
            "form.reply",
            "We will reply using the contact details you provide.",
          )}
        </span>
      </div>

      <div className="mt-5 min-h-12" aria-live="polite">
        {status === "error" ? (
          <StatusMessage tone="error">{statusMessage}</StatusMessage>
        ) : null}
        {status === "success" ? (
          <StatusMessage tone="success">
            {t(
              "form.success",
              "Your brief was sent. Thank you — our team will contact you using the details provided.",
            )}
          </StatusMessage>
        ) : null}
      </div>
    </form>
  );
}

function DynamicInput({
  field,
  value,
  error,
  onChange,
}: {
  field: DynamicFieldConfig;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  const id = `extra-${field.key}`;
  return (
    <div className="sm:col-span-1">
      <label htmlFor={id} className="block text-sm font-bold text-ink">
        {field.label}
      </label>
      <input
        id={id}
        name={field.key}
        maxLength={CONTACT_LIMITS[field.key]}
        type="text"
        className={inputClassName}
        placeholder={field.placeholder}
        value={value}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(event) => onChange(event.target.value)}
      />
      {error ? (
        <p
          id={`${id}-error`}
          className="mt-2 flex items-start gap-2 text-sm font-semibold text-danger"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: "name" | "contact" | "company" | "service" | "message";
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  const errorId = id + "-error";
  const inputId = id === "contact" ? "contact-value" : id;

  return (
    <div>
      <label className="block text-sm font-bold text-ink" htmlFor={inputId}>
        {label}
      </label>
      {children}
      {error ? (
        <p
          id={errorId}
          className="mt-2 flex items-start gap-2 text-sm font-semibold text-danger"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

function StatusMessage({
  tone,
  children,
}: {
  tone: "info" | "error" | "success";
  children: React.ReactNode;
}) {
  const styles = {
    info: "border-blue-200 bg-blue-50 text-blue-900",
    error: "border-red-200 bg-red-50 text-red-900",
    success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  };

  return (
    <p
      className={`flex items-start gap-3 border p-3 text-sm font-semibold ${styles[tone]}`}
    >
      {tone === "success" ? (
        <Check className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      ) : (
        <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      )}
      {children}
    </p>
  );
}
