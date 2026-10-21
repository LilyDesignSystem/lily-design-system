// toggle-button.test.js
// ToggleButton component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("button.toggle-button");


describe("ToggleButton", () => {
  it("renders the element with its base class", async () => {
    await mount("toggle-button");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("toggle-button")).toBe(true);
  });

  it("starts unpressed", async () => {
    await mount("toggle-button");
    expect(el().getAttribute("aria-pressed")).toBe("false");
  });
  it("toggles aria-pressed on click", async () => {
    await mount("toggle-button");
    el().click(); await tick();
    expect(el().getAttribute("aria-pressed")).toBe("true");
    el().click(); await tick();
    expect(el().getAttribute("aria-pressed")).toBe("false");
  });
});
