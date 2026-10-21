// tooltip.test.js
// Tooltip component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.tooltip");
const trigger = () => document.querySelector(".tooltip-trigger");
const tip = () => document.querySelector("div.tooltip");

describe("Tooltip", () => {
  it("renders the element with its base class", async () => {
    await mount("tooltip");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("tooltip")).toBe(true);
  });

  it("is hidden until the trigger is focused", async () => {
    await mount("tooltip");
    expect(tip().hidden).toBe(true);
    expect(tip().getAttribute("role")).toBe("tooltip");
    trigger().dispatchEvent(new FocusEvent("focus")); await tick();
    expect(tip().hidden).toBe(false);
    expect(tip().getAttribute("aria-hidden")).toBe("false");
  });
  it("shows on hover and stays while the pointer is on the tooltip", async () => {
    await mount("tooltip");
    trigger().dispatchEvent(new MouseEvent("mouseenter")); await tick();
    expect(tip().hidden).toBe(false);
    trigger().dispatchEvent(new MouseEvent("mouseleave"));
    tip().dispatchEvent(new MouseEvent("mouseenter")); await tick();
    expect(tip().hidden).toBe(false);
  });
  it("is dismissed by Escape without moving focus", async () => {
    await mount("tooltip");
    trigger().focus();
    trigger().dispatchEvent(new FocusEvent("focus")); await tick();
    trigger().dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })); await tick();
    expect(tip().hidden).toBe(true);
    expect(document.activeElement).toBe(trigger());
  });
});
