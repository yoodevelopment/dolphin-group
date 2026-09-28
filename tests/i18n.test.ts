import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { test } from "node:test";
import { getDynamicFields } from "../lib/contact";
import { services } from "../lib/services";

const translationSource = readFileSync(
  resolve(process.cwd(), "lib/i18n.tsx"),
  "utf8",
);
const declaredKeys = new Set(
  [...translationSource.matchAll(/["']([A-Za-z0-9._:-]+)["']\s*:/g)].map(
    (match) => match[1],
  ),
);

test("service problem copy resolves to Russian instead of the English fallback", () => {
  assert.ok(declaredKeys.has("service.mvp.problem"));
  assert.match(translationSource, /Идея должна стать продуктом/);
});

test("all runtime-generated translation keys exist in Russian and Spanish", () => {
  const keys = new Set<string>();
  for (const service of services) {
    for (const part of ["title", "problem", "short", "marker", "result"]) {
      keys.add(`service.${service.id}.${part}`);
    }
    service.includes.forEach((_, index) => {
      keys.add(`service.${service.id}.include.${index + 1}`);
    });
    for (const field of getDynamicFields(service.id)) {
      for (const part of ["label", "placeholder", "error"]) {
        keys.add(`field.${field.key}.${part}`);
      }
    }
  }

  for (const id of [
    "launch",
    "automate",
    "connect",
    "dashboard",
    "agent",
    "migrate",
    "shop",
  ]) {
    keys.add(`finder.${id}.label`);
    keys.add(`finder.${id}.note`);
  }
  for (const id of [
    "discovery",
    "design",
    "build",
    "validation",
    "launch",
    "support",
  ]) {
    for (const part of ["title", "description", "output"]) {
      keys.add(`process.${id}.${part}`);
    }
  }
  for (const id of ["crm", "ai", "api", "analytics"]) {
    keys.add(`demo.${id}.label`);
    keys.add(`demo.${id}.copy`);
  }
  for (const id of ["web", "crm", "api", "cloud", "ai", "analytics"]) {
    keys.add(`ecosystem.${id}`);
    keys.add(`ecosystem.${id}.copy`);
  }
  for (const id of ["product", "systems", "infrastructure", "intelligence"]) {
    keys.add(`technology.${id}`);
    keys.add(`technology.${id}.copy`);
  }
  for (const state of ["before", "after"]) {
    for (let index = 1; index <= 4; index++) {
      keys.add(`automation.${state}.item.${index}.title`);
      keys.add(`automation.${state}.item.${index}.detail`);
    }
  }
  keys.add("testimonials.author.2");
  keys.add("testimonials.quote.1");
  keys.add("testimonials.quote.2");
  keys.add("project.newTab");
  keys.add("form.honeypot");
  for (const id of [
    "mvp.window",
    "mvp.workspace",
    "mvp.backlog",
    "mvp.build",
    "mvp.ready",
    "crm.window",
    "crm.new",
    "crm.progress",
    "crm.nextAction",
    "crm.activity",
    "crm.lead",
    "crm.call",
    "crm.brief",
    "crm.scope",
    "api.gateway",
    "cloud.region",
    "store.title",
    "store.checkout",
    "store.order",
    "store.item",
    "store.delivery",
    "store.payment",
    "ai.agent",
    "ai.knowledge",
    "ai.prompt",
    "ai.response",
    "ai.answer",
    "ai.completed",
    "growth.form",
    "growth.score",
    "growth.crm",
    "growth.action",
    "growth.lead",
    "growth.route",
    "growth.email",
    "growth.manager",
    "growth.report",
    "analytics.title",
    "analytics.weekly",
    "analytics.pipeline",
    "analytics.tasks",
    "analytics.signals",
    "rpa.read",
    "rpa.update",
    "rpa.create",
    "rpa.notify",
  ]) {
    keys.add(`visual.${id}`);
  }
  for (const id of [
    "active",
    "ready",
    "queued",
    "notified",
    "synced",
    "done",
    "next",
  ]) {
    keys.add(`visual.status.${id}`);
  }
  for (const id of ["en", "ru", "es"]) keys.add(`language.${id}`);
  for (const id of [
    "maxLength",
    "controlCharacters",
    "minLength",
    "contact",
    "service",
    "message",
    "consent",
    "invalidRequest",
    "textRequired",
  ]) {
    keys.add(`form.error.${id}`);
  }

  for (const locale of ["ru", "es"] as const) {
    for (const key of keys) {
      assert.ok(declaredKeys.has(key), `${locale} is missing ${key}`);
    }
  }
});
