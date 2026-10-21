// navigation-menu.test.js
// NavigationMenu component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("nav.navigation-menu");


describe("NavigationMenu", () => {
  it("renders the element with its base class", async () => {
    await mount("navigation-menu");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("navigation-menu")).toBe(true);
  });

  it("uses the nav element", async () => {
    await mount("navigation-menu");
    expect(el().tagName.toLowerCase()).toBe("nav");
  });
});
