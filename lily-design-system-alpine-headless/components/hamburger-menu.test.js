// hamburger-menu.test.js
// HamburgerMenu component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.hamburger-menu");


describe("HamburgerMenu", () => {
  it("renders the element with its base class", async () => {
    await mount("hamburger-menu");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("hamburger-menu")).toBe(true);
  });

  const button = () => document.querySelector(".hamburger-menu-button");
  const nav = () => document.querySelector(".hamburger-menu-nav");
  it("starts closed with a hidden navigation", async () => {
    await mount("hamburger-menu");
    expect(button().getAttribute("aria-expanded")).toBe("false");
    expect(button().getAttribute("aria-controls")).toBe(nav().id);
    expect(nav().hidden).toBe(true);
  });
  it("toggles the navigation", async () => {
    await mount("hamburger-menu");
    button().click(); await tick();
    expect(button().getAttribute("aria-expanded")).toBe("true");
    expect(nav().hidden).toBe(false);
    button().click(); await tick();
    expect(nav().hidden).toBe(true);
  });
});
