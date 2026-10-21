// expander.test.js
// Expander component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.expander");


describe("Expander", () => {
  it("renders the element with its base class", async () => {
    await mount("expander");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("expander")).toBe(true);
  });

  it("expands and collapses", async () => {
    await mount("expander");
    const t = document.querySelector("[data-trigger]"), c = document.querySelector("[data-content]");
    expect(t.getAttribute("aria-expanded")).toBe("false");
    expect(c.hidden).toBe(true);
    t.click(); await tick();
    expect(t.getAttribute("aria-expanded")).toBe("true");
    expect(c.hidden).toBe(false);
    expect(el().getAttribute("data-expanded")).toBe("true");
  });
});
