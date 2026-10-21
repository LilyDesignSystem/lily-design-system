// mockup-browser.test.js
// MockupBrowser component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.mockup-browser");


describe("MockupBrowser", () => {
  it("renders the element with its base class", async () => {
    await mount("mockup-browser");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("mockup-browser")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("mockup-browser");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
