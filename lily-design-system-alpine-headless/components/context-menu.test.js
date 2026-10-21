// context-menu.test.js
// ContextMenu component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.context-menu");
const target = () => document.querySelector(".context-menu-target");
const items = () => [...document.querySelectorAll(".context-menu-item")];
const press = async (target, key, init = {}) => {
  target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init }));
  await tick();
};

describe("ContextMenu", () => {
  it("renders the element with its base class", async () => {
    await mount("context-menu");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("context-menu")).toBe(true);
  });

  it('is a hidden role="menu"', async () => {
    await mount("context-menu");
    expect(el().getAttribute("role")).toBe("menu");
    expect(el().hidden).toBe(true);
  });
  it("opens on the context-menu event at the pointer and focuses the first item", async () => {
    await mount("context-menu");
    target().dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, cancelable: true, clientX: 40, clientY: 60 }));
    await tick(); await tick();
    expect(el().hidden).toBe(false);
    expect(el().style.getPropertyValue("--context-menu-x")).toBe("40px");
    expect(el().style.getPropertyValue("--context-menu-y")).toBe("60px");
    expect(document.activeElement).toBe(items()[0]);
  });
  it("opens from the keyboard (ContextMenu key and Shift+F10)", async () => {
    await mount("context-menu");
    await press(target(), "ContextMenu"); await tick();
    expect(el().hidden).toBe(false);
    document.body.click(); await tick();
    expect(el().hidden).toBe(true);
    await press(target(), "F10", { shiftKey: true }); await tick();
    expect(el().hidden).toBe(false);
  });
  it("Escape closes and returns focus to the target", async () => {
    await mount("context-menu");
    target().focus();
    await press(target(), "ContextMenu"); await tick();
    await press(document.activeElement, "Escape");
    expect(el().hidden).toBe(true);
    expect(document.activeElement).toBe(target());
  });
  it("arrows move through the items; choosing one closes", async () => {
    await mount("context-menu");
    await press(target(), "ContextMenu"); await tick();
    await press(items()[0], "ArrowDown");
    expect(document.activeElement).toBe(items()[1]);
    items()[1].click(); await tick();
    expect(el().hidden).toBe(true);
  });
});
