// popup.test.js
// Popup component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.popup");


describe("Popup", () => {
  it("renders the element with its base class", async () => {
    await mount("popup");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("popup")).toBe(true);
  });

  const trigger = () => document.querySelector(".popup-trigger");
  it("is closed, with the dialog role", async () => {
    await mount("popup");
    expect(el().hidden).toBe(true);
    expect(el().getAttribute("role")).toBe("dialog");
    expect(el().hasAttribute("aria-modal")).toBe(false);
    expect(trigger().getAttribute("aria-expanded")).toBe("false");
  });
  it("opens, moves focus in, and the close button returns focus to the trigger", async () => {
    await mount("popup");
    trigger().focus(); trigger().click(); await tick(); await tick();
    expect(el().hidden).toBe(false);
    expect(el().getAttribute("data-open")).toBe("true");
    expect(el().contains(document.activeElement)).toBe(true);
    document.querySelector(".popup-close").click(); await tick();
    expect(el().hidden).toBe(true);
    expect(document.activeElement).toBe(trigger());
  });
  it("closes on Escape", async () => {
    await mount("popup");
    trigger().click(); await tick(); await tick();
    el().dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })); await tick();
    expect(el().hidden).toBe(true);
    expect(document.activeElement).toBe(trigger());
  });
});
