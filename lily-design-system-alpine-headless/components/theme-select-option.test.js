// theme-select-option.test.js
// ThemeSelectOption component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("option.theme-select-option");


describe("ThemeSelectOption", () => {
  it("renders the element with its base class", async () => {
    await mount("theme-select-option");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("theme-select-option")).toBe(true);
  });

  it("uses the option element", async () => {
    await mount("theme-select-option");
    expect(el().tagName.toLowerCase()).toBe("option");
  });
});
