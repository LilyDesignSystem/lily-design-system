// text-area-input-with-character-counter.test.js
// TextAreaInputWithCharacterCounter component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.text-area-input-with-character-counter");
import { snippet } from "../test/mount.js";
const press = async (target, key, init = {}) => {
  target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init }));
  await tick();
};
const type = async (field, text) => {
  field.value = text;
  field.dispatchEvent(new Event("input", { bubbles: true }));
  await tick();
};
const area = () => el().querySelector("textarea");
const count = () => el().querySelector("span");

describe("TextAreaInputWithCharacterCounter", () => {
  it("renders the element with its base class", async () => {
    await mount("text-area-input-with-character-counter");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("text-area-input-with-character-counter")).toBe(true);
  });

  it("links the textarea to a polite counter", async () => {
    await mount("text-area-input-with-character-counter");
    expect(area().getAttribute("aria-describedby")).toBe(count().id);
    expect(count().getAttribute("aria-live")).toBe("polite");
    expect(count().textContent).toBe("0 / 20");
  });
  it("updates as the user types", async () => {
    await mount("text-area-input-with-character-counter");
    await type(area(), "hello world");
    expect(count().textContent).toBe("11 / 20");
    expect(area().hasAttribute("aria-invalid")).toBe(false);
  });
  it("flags the textarea invalid and the counter over limit past the maximum", async () => {
    await mount("text-area-input-with-character-counter");
    await type(area(), "x".repeat(21));
    expect(area().getAttribute("aria-invalid")).toBe("true");
    expect(count().hasAttribute("data-over-limit")).toBe(true);
    await type(area(), "x".repeat(5));
    expect(area().hasAttribute("aria-invalid")).toBe(false);
  });
});
