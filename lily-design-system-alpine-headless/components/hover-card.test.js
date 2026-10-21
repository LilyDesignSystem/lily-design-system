// hover-card.test.js
// HoverCard component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.hover-card");


describe("HoverCard", () => {
  it("renders the element with its base class", async () => {
    await mount("hover-card");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("hover-card")).toBe(true);
  });

  it("opens on hover and closes on leave", async () => {
    await mount("hover-card");
    const c = document.querySelector(".hover-card-content");
    expect(c.hidden).toBe(true);
    el().dispatchEvent(new MouseEvent("mouseenter")); await tick();
    expect(c.hidden).toBe(false);
    expect(el().getAttribute("data-open")).toBe("true");
    el().dispatchEvent(new MouseEvent("mouseleave")); await tick();
    expect(c.hidden).toBe(true);
  });
  it("opens on focus within and Escape dismisses", async () => {
    await mount("hover-card");
    const c = document.querySelector(".hover-card-content");
    el().dispatchEvent(new FocusEvent("focusin", { bubbles: true })); await tick();
    expect(c.hidden).toBe(false);
    el().dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })); await tick();
    expect(c.hidden).toBe(true);
  });
});
