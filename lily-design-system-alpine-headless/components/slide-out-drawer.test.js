// slide-out-drawer.test.js
// SlideOutDrawer component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.slide-out-drawer");


describe("SlideOutDrawer", () => {
  it("renders the element with its base class", async () => {
    await mount("slide-out-drawer");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("slide-out-drawer")).toBe(true);
  });

  const trigger = () => document.querySelector(".slide-out-drawer-trigger");
  it("is closed, with the dialog role and aria-modal", async () => {
    await mount("slide-out-drawer");
    expect(el().hidden).toBe(true);
    expect(el().getAttribute("role")).toBe("dialog");
    expect(el().getAttribute("aria-modal")).toBe("true");
    expect(trigger().getAttribute("aria-expanded")).toBe("false");
  });
  it("opens, moves focus in, and the close button returns focus to the trigger", async () => {
    await mount("slide-out-drawer");
    trigger().focus(); trigger().click(); await tick(); await tick();
    expect(el().hidden).toBe(false);
    expect(el().getAttribute("data-open")).toBe("true");
    expect(el().contains(document.activeElement)).toBe(true);
    document.querySelector(".slide-out-drawer-close").click(); await tick();
    expect(el().hidden).toBe(true);
    expect(document.activeElement).toBe(trigger());
  });
  it("closes on Escape", async () => {
    await mount("slide-out-drawer");
    trigger().click(); await tick(); await tick();
    el().dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })); await tick();
    expect(el().hidden).toBe(true);
    expect(document.activeElement).toBe(trigger());
  });
});
