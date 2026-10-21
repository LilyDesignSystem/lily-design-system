// editable-form.test.js
// EditableForm component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("form.editable-form");
const press = async (target, key, init = {}) => {
  target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init }));
  await tick();
};
const type = async (field, text) => {
  field.value = text;
  field.dispatchEvent(new Event("input", { bubbles: true }));
  await tick();
};
const edit = () => document.querySelector(".editable-form-edit");

describe("EditableForm", () => {
  it("renders the element with its base class", async () => {
    await mount("editable-form");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("editable-form")).toBe(true);
  });

  it("starts as a hidden form with an edit button", async () => {
    await mount("editable-form");
    expect(el().hidden).toBe(true);
    expect(el().getAttribute("tabindex")).toBe("-1");
    expect(edit().hidden).toBe(false);
  });
  it("the edit button opens the form and moves focus to it", async () => {
    await mount("editable-form");
    edit().click(); await tick(); await tick();
    expect(el().hidden).toBe(false);
    expect(edit().hidden).toBe(true);
    expect(document.activeElement).toBe(el());
  });
  it("submit is prevented, announces the values and leaves edit mode", async () => {
    await mount("editable-form");
    const seen = vi.fn();
    document.body.addEventListener("lily:submit", (e) => seen(e.detail));
    edit().click(); await tick();
    el().querySelector("input").value = "Dr";
    const event = new Event("submit", { bubbles: true, cancelable: true });
    el().dispatchEvent(event); await tick();
    expect(event.defaultPrevented).toBe(true);
    expect(seen).toHaveBeenCalledWith({ values: { title: "Dr" } });
    expect(el().hidden).toBe(true);
  });
  it("Escape cancels and leaves edit mode", async () => {
    await mount("editable-form");
    const cancelled = vi.fn();
    document.body.addEventListener("lily:cancel", cancelled);
    edit().click(); await tick();
    await press(el().querySelector("input"), "Escape");
    expect(el().hidden).toBe(true);
    expect(cancelled).toHaveBeenCalled();
  });
});
