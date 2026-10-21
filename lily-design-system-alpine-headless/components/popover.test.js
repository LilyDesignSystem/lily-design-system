// popover.test.js
// Popover component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.popover");
const trigger = () => document.querySelector(".popover-trigger");
const panel = () => document.querySelector(".popover-panel");

describe("Popover", () => {
  it("renders the element with its base class", async () => {
    await mount("popover");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("popover")).toBe(true);
  });

  it("starts closed", async () => {
    await mount("popover");
    expect(trigger().getAttribute("aria-expanded")).toBe("false");
    expect(panel().hidden).toBe(true);
  });
  it("opens on click", async () => {
    await mount("popover");
    trigger().click(); await tick();
    expect(trigger().getAttribute("aria-expanded")).toBe("true");
    expect(panel().hidden).toBe(false);
  });
  it("closes on Escape and returns focus to the trigger", async () => {
    await mount("popover");
    trigger().click(); await tick();
    panel().dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await tick();
    expect(panel().hidden).toBe(true);
    expect(document.activeElement).toBe(trigger());
  });
  it("closes on an outside click", async () => {
    await mount("popover");
    trigger().click(); await tick();
    document.body.click(); await tick();
    expect(panel().hidden).toBe(true);
  });
});
