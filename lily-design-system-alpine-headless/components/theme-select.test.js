// theme-select.test.js
// ThemeSelect component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("select.theme-select");


describe("ThemeSelect", () => {
  it("renders the element with its base class", async () => {
    await mount("theme-select");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("theme-select")).toBe(true);
  });

  it("uses the select element", async () => {
    await mount("theme-select");
    expect(el().tagName.toLowerCase()).toBe("select");
  });
});
