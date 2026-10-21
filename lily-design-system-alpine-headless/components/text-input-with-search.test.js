// text-input-with-search.test.js
// TextInputWithSearch component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.text-input-with-search");
const press = async (target, key, init = {}) => {
  target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init }));
  await tick();
};
const type = async (field, text) => {
  field.value = text;
  field.dispatchEvent(new Event("input", { bubbles: true }));
  await tick();
};
const field = () => el().querySelector("input");
const button = () => el().querySelector("button");

describe("TextInputWithSearch", () => {
  it("renders the element with its base class", async () => {
    await mount("text-input-with-search");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("text-input-with-search")).toBe(true);
  });

  it("is a search landmark with a text field and a button", async () => {
    await mount("text-input-with-search");
    expect(el().getAttribute("role")).toBe("search");
    expect(field().type).toBe("text");
    expect(button().type).toBe("button");
  });
  it("Enter in the field searches with the current value", async () => {
    await mount("text-input-with-search");
    const seen = vi.fn();
    el().addEventListener("lily:search", (e) => seen(e.detail));
    await type(field(), "lily");
    await press(field(), "Enter");
    expect(seen).toHaveBeenCalledWith({ value: "lily" });
  });
  it("the button searches too", async () => {
    await mount("text-input-with-search");
    const seen = vi.fn();
    el().addEventListener("lily:search", (e) => seen(e.detail));
    await type(field(), "design");
    button().click(); await tick();
    expect(seen).toHaveBeenCalledWith({ value: "design" });
  });
});
