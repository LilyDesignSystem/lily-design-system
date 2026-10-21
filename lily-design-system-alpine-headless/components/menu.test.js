// menu.test.js
// Menu component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.menu");
const items = () => [...document.querySelectorAll(".menu-item")];
const press = async (target, key, init = {}) => {
  target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init }));
  await tick();
};

describe("Menu", () => {
  it("renders the element with its base class", async () => {
    await mount("menu");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("menu")).toBe(true);
  });

  it('is role="menu" with one tabbable menuitem', async () => {
    await mount("menu");
    expect(el().getAttribute("role")).toBe("menu");
    expect(items().map((i) => i.getAttribute("role"))).toEqual(["menuitem", "menuitem", "menuitem"]);
    expect(items().map((i) => i.getAttribute("tabindex"))).toEqual(["0", "-1", "-1"]);
  });
  it("ArrowDown / ArrowUp move focus with wrapping, and the tab stop follows", async () => {
    await mount("menu");
    items()[0].focus();
    await press(items()[0], "ArrowUp");
    expect(document.activeElement).toBe(items()[2]);
    expect(items().map((i) => i.getAttribute("tabindex"))).toEqual(["-1", "-1", "0"]);
    await press(items()[2], "ArrowDown");
    expect(document.activeElement).toBe(items()[0]);
  });
  it("Home and End jump", async () => {
    await mount("menu");
    items()[0].focus();
    await press(items()[0], "End");
    expect(document.activeElement).toBe(items()[2]);
    await press(items()[2], "Home");
    expect(document.activeElement).toBe(items()[0]);
  });
  it("ignores the other axis", async () => {
    await mount("menu");
    items()[0].focus();
    await press(items()[0], "ArrowRight");
    expect(document.activeElement).toBe(items()[0]);
  });
});
