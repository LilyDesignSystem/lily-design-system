// contextual-help.test.js
// ContextualHelp component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.contextual-help");


describe("ContextualHelp", () => {
  it("renders the element with its base class", async () => {
    await mount("contextual-help");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("contextual-help")).toBe(true);
  });

  it("opens, and Escape closes it and returns focus", async () => {
    await mount("contextual-help");
    const t = document.querySelector(".contextual-help-trigger"), p = document.querySelector(".contextual-help-panel");
    expect(p.hidden).toBe(true);
    t.click(); await tick();
    expect(t.getAttribute("aria-expanded")).toBe("true");
    expect(p.hidden).toBe(false);
    p.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })); await tick();
    expect(p.hidden).toBe(true);
    expect(document.activeElement).toBe(t);
  });
});
