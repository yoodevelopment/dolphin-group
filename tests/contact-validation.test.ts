import assert from "node:assert/strict";
import { test } from "node:test";
import { CONTACT_LIMITS, getDynamicFields, initialContactFields, parseContactPayload, validateContactFields } from "../lib/contact";
import { services } from "../lib/services";
const valid = () => ({ ...initialContactFields, name: " Visitor ", contact: "visitor@example.com", service: "commerce", commercePlatform: "New build", message: "Please build a new store for our products.", consent: true });

test("normalizes valid input, fills optional fields and ignores recipient overrides", () => {
  const result = parseContactPayload({ name: " Visitor ", contact: "visitor@example.com", service: "commerce", commercePlatform: "New build", message: "Please build a new store for our products.", consent: true, to: "other@example.com" });
  assert.equal(result.ok, true);
  if (result.ok) { assert.equal(result.fields.name, "Visitor"); assert.equal(result.fields.company, ""); assert.ok(!("to" in result.fields)); }
});

test("rejects malformed values, string consent, invalid types and unknown services", () => {
  for (const value of [null, [], "string", { ...valid(), consent: "true" }, { ...valid(), name: ["Visitor"] }, { ...valid(), message: 123 }, { ...valid(), company: {} }, { ...valid(), service: "constructor" }, { ...valid(), service: "__proto__" }]) assert.equal(parseContactPayload(value).ok, false);
});

test("does not accept letters as phone numbers, invalid email or header injection", () => {
  for (const contact of ["wrong123456789", "hello1234567@invalid", "a@example.com\r\nBcc: attacker@example.com", "+123", "+1234567890123456"]) assert.ok(validateContactFields({ ...valid(), contact }).contact);
  assert.ok(validateContactFields({ ...valid(), name: "Visitor\nInjected" }).name);
  for (const contact of ["a@example.com", "+998 (90) 123-45-67", "020 7123 4567"]) assert.equal(validateContactFields({ ...valid(), contact }).contact, undefined);
});

test("bounds all strings and allows ordinary multiline project context", () => {
  for (const [key, max] of Object.entries(CONTACT_LIMITS)) assert.equal(parseContactPayload({ ...valid(), [key]: "x".repeat(max + 1) }).ok, false);
  assert.equal(parseContactPayload({ ...valid(), message: "We need a new store.\nPlease include a product catalog." }).ok, true);
});

test("all nine services require the matching additional fields", () => {
  for (const service of services) {
    const fields = { ...valid(), commercePlatform: "", service: service.id };
    for (const extra of getDynamicFields(service.id)) {
      assert.ok(validateContactFields(fields)[extra.key]);
      fields[extra.key] = "Relevant project details";
    }
    assert.deepEqual(validateContactFields(fields), {});
  }
});
