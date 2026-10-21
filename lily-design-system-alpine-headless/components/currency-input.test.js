// currency-input.test.js
// CurrencyInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.currency-input");
const press = async (target, key, init = {}) => {
  target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init }));
  await tick();
};
const type = async (field, text) => {
  field.value = text;
  field.dispatchEvent(new Event("input", { bubbles: true }));
  await tick();
};

describe("CurrencyInput", () => {
  it("renders the element with its base class", async () => {
    await mount("currency-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("currency-input")).toBe(true);
  });

  it("is a decimal text field carrying its currency code", async () => {
    await mount("currency-input");
    expect(el().type).toBe("text");
    expect(el().getAttribute("inputmode")).toBe("decimal");
    expect(el().getAttribute("data-currency-code")).toBe("GBP");
  });
  it("keeps only digits and a single decimal point", async () => {
    await mount("currency-input");
    await type(el(), "£1a2,3.4.5");
    expect(el().value).toBe("123.45");
  });
  it("flags aria-invalid outside min and max", async () => {
    await mount("currency-input");
    await type(el(), "150");
    expect(el().getAttribute("aria-invalid")).toBe("true");
    await type(el(), "50");
    expect(el().hasAttribute("aria-invalid")).toBe(false);
  });
});
