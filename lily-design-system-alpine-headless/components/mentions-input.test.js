// mentions-input.test.js
// MentionsInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.mentions-input");
const press = async (target, key, init = {}) => {
  target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init }));
  await tick();
};
const type = async (field, text) => {
  field.value = text;
  field.dispatchEvent(new Event("input", { bubbles: true }));
  await tick();
};
const input = () => el().querySelector("input");
const panel = () => el().querySelector(".mentions-input-suggestions");
const opts = () => [...el().querySelectorAll(".mentions-input-option")];
const label = async () => { ["Alice", "Alan", "Bob"].forEach((t, i) => (opts()[i].textContent = t)); await tick(); };

describe("MentionsInput", () => {
  it("renders the element with its base class", async () => {
    await mount("mentions-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("mentions-input")).toBe(true);
  });

  it("starts closed with the combobox contract on the input", async () => {
    await mount("mentions-input");
    expect(input().getAttribute("role")).toBe("combobox");
    expect(input().getAttribute("aria-expanded")).toBe("false");
    expect(panel().hidden).toBe(true);
  });
  it("opens when the trigger character is typed and filters by what follows", async () => {
    await mount("mentions-input"); await label();
    await type(input(), "hi");
    expect(panel().hidden).toBe(true);
    await type(input(), "hi @al");
    expect(panel().hidden).toBe(false);
    expect(input().getAttribute("aria-expanded")).toBe("true");
    expect(opts().map((o) => o.hidden)).toEqual([false, false, true]);
  });
  it("closes once the mention is finished by a space", async () => {
    await mount("mentions-input"); await label();
    await type(input(), "hi @al");
    await type(input(), "hi @al ");
    expect(panel().hidden).toBe(true);
  });
  it("arrows move the active option and Enter inserts it in place of the query", async () => {
    await mount("mentions-input"); await label();
    await type(input(), "hi @al");
    await press(input(), "ArrowDown");
    await press(input(), "ArrowDown");
    expect(input().getAttribute("aria-activedescendant")).toBe(opts()[1].id);
    await press(input(), "Enter");
    expect(input().value).toBe("hi @Alan ");
    expect(panel().hidden).toBe(true);
  });
  it("Escape closes the suggestions", async () => {
    await mount("mentions-input"); await label();
    await type(input(), "@");
    await press(input(), "Escape");
    expect(panel().hidden).toBe(true);
    expect(input().getAttribute("aria-expanded")).toBe("false");
  });
});
