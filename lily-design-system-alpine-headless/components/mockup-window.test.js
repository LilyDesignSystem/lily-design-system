// mockup-window.test.js
// MockupWindow component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.mockup-window");


describe("MockupWindow", () => {
  it("renders the element with its base class", async () => {
    await mount("mockup-window");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("mockup-window")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("mockup-window");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
