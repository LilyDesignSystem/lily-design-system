// theme-view.test.js
// ThemeView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.theme-view");


describe("ThemeView", () => {
  it("renders the element with its base class", async () => {
    await mount("theme-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("theme-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("theme-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
