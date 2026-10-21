// menu-bar.test.js
// MenuBar component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.menu-bar");
const items = () => [...document.querySelectorAll(".menu-bar-item")];
const press = async (target, key, init = {}) => {
  target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init }));
  await tick();
};

describe("MenuBar", () => {
  it("renders the element with its base class", async () => {
    await mount("menu-bar");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("menu-bar")).toBe(true);
  });

  it('is role="menubar" with one tabbable menuitem', async () => {
    await mount("menu-bar");
    expect(el().getAttribute("role")).toBe("menubar");
    expect(items().map((i) => i.getAttribute("role"))).toEqual(["menuitem", "menuitem", "menuitem"]);
    expect(items().map((i) => i.getAttribute("tabindex"))).toEqual(["0", "-1", "-1"]);
  });
  it("ArrowRight / ArrowLeft move focus with wrapping, and the tab stop follows", async () => {
    await mount("menu-bar");
    items()[0].focus();
    await press(items()[0], "ArrowLeft");
    expect(document.activeElement).toBe(items()[2]);
    expect(items().map((i) => i.getAttribute("tabindex"))).toEqual(["-1", "-1", "0"]);
    await press(items()[2], "ArrowRight");
    expect(document.activeElement).toBe(items()[0]);
  });
  it("Home and End jump", async () => {
    await mount("menu-bar");
    items()[0].focus();
    await press(items()[0], "End");
    expect(document.activeElement).toBe(items()[2]);
    await press(items()[2], "Home");
    expect(document.activeElement).toBe(items()[0]);
  });
  it("ignores the other axis", async () => {
    await mount("menu-bar");
    items()[0].focus();
    await press(items()[0], "ArrowDown");
    expect(document.activeElement).toBe(items()[0]);
  });
});
