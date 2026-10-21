// theme-provider.test.js
// ThemeProvider component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.theme-provider");


describe("ThemeProvider", () => {
  it("renders the element with its base class", async () => {
    await mount("theme-provider");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("theme-provider")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("theme-provider");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
