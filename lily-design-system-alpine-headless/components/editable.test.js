// editable.test.js
// Editable component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.editable");
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
const display = () => el().querySelector(".editable-display");
const field = () => el().querySelector("input");
const named = (args) => snippet("editable").replace("lilyEditable('', false, '')", "lilyEditable(" + args + ")");

describe("Editable", () => {
  it("renders the element with its base class", async () => {
    await mount("editable");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("editable")).toBe(true);
  });

  it("shows the display as a button and hides the field", async () => {
    await mount("editable", named("'Joel', false, 'Name'"));
    expect(display().getAttribute("role")).toBe("button");
    expect(display().getAttribute("tabindex")).toBe("0");
    expect(display().textContent).toBe("Joel");
    expect(display().getAttribute("aria-label")).toBe("Joel, Name");
    expect(field().hidden).toBe(true);
  });
  it("the name is the label alone while the value is empty", async () => {
    await mount("editable", named("'', false, 'Name'"));
    expect(display().getAttribute("aria-label")).toBe("Name");
  });
  it("a click or Enter or Space starts editing and focuses the field", async () => {
    for (const start of [() => display().click(), () => press(display(), "Enter"), () => press(display(), " ")]) {
      await mount("editable", named("'Joel', false, 'Name'"));
      await start(); await tick();
      expect(display().hidden).toBe(true);
      expect(field().hidden).toBe(false);
      expect(field().value).toBe("Joel");
      expect(field().getAttribute("aria-label")).toBe("Name");
      expect(document.activeElement).toBe(field());
    }
  });
  it("Enter confirms the draft, announces it and returns focus to the display", async () => {
    await mount("editable", named("'Joel', false, 'Name'"));
    const seen = vi.fn();
    el().addEventListener("lily:change", (e) => seen(e.detail));
    display().click(); await tick();
    await type(field(), "Ada");
    await press(field(), "Enter"); await tick();
    expect(display().textContent).toBe("Ada");
    expect(display().hidden).toBe(false);
    expect(seen).toHaveBeenCalledWith({ value: "Ada" });
    expect(document.activeElement).toBe(display());
  });
  it("Escape discards the draft", async () => {
    await mount("editable", named("'Joel', false, 'Name'"));
    display().click(); await tick();
    await type(field(), "Ada");
    await press(field(), "Escape"); await tick();
    expect(display().textContent).toBe("Joel");
    expect(field().hidden).toBe(true);
  });
  it("when disabled it is not tabbable and does not edit", async () => {
    await mount("editable", named("'Joel', false, 'Name', true"));
    expect(display().getAttribute("tabindex")).toBe("-1");
    expect(display().getAttribute("aria-disabled")).toBe("true");
    display().click(); await tick();
    expect(field().hidden).toBe(true);
  });
});
