// cascader.test.js
// Cascader component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.cascader");
const press = async (target, key, init = {}) => {
  target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init }));
  await tick();
};
const item = (id) => document.querySelector('[data-item="' + id + '"]');
const items = () => [...document.querySelectorAll('[role="treeitem"]')];
const name = (id, text) => item(id).prepend(text);
const nameAll = () => Object.entries({ one: "Fruit", "one-a": "Apple", "one-b": "Berry", two: "Tea", three: "Veg", "three-a": "Kale" }).forEach(([id, t]) => name(id, t));

describe("Cascader", () => {
  it("renders the element with its base class", async () => {
    await mount("cascader");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("cascader")).toBe(true);
  });

  const trigger = () => el().querySelector("button");
  const panel = () => el().querySelector("[class$=-panel]");
  const open = async () => { trigger().click(); await tick(); await tick(); };
  it("is a combobox popping a tree, closed at first", async () => {
    await mount("cascader");
    expect(el().getAttribute("role")).toBe("combobox");
    expect(el().getAttribute("aria-haspopup")).toBe("tree");
    expect(el().getAttribute("aria-expanded")).toBe("false");
    expect(panel().hidden).toBe(true);
  });
  it("the trigger opens the panel and moves focus into the tree; Escape returns it", async () => {
    await mount("cascader");
    trigger().focus();
    await open();
    expect(el().getAttribute("aria-expanded")).toBe("true");
    expect(panel().hidden).toBe(false);
    expect(document.activeElement).toBe(item("one"));
    await press(document.activeElement, "Escape");
    expect(el().getAttribute("aria-expanded")).toBe("false");
    expect(panel().hidden).toBe(true);
    expect(document.activeElement).toBe(trigger());
  });
  it("ArrowDown on the trigger opens it; an outside click closes it", async () => {
    await mount("cascader");
    await press(trigger(), "ArrowDown"); await tick();
    expect(panel().hidden).toBe(false);
    document.body.click(); await tick();
    expect(panel().hidden).toBe(true);
  });
  it("choosing a leaf selects it, announces the path and closes", async () => {
    await mount("cascader");
    const seen = vi.fn();
    el().addEventListener("lily:select", (e) => seen(e.detail));
    await open();
    item("one").click(); await tick();
    item("one-b").click(); await tick();
    expect(item("one-b").getAttribute("aria-selected")).toBe("true");
    expect(seen).toHaveBeenCalledWith({ selected: ["one-b"], path: ["one", "one-b"] });
    expect(panel().hidden).toBe(true);
    expect(document.activeElement).toBe(trigger());
  });
  it("opening a branch closes its siblings (one list per level)", async () => {
    await mount("cascader"); await open();
    item("one").click(); await tick();
    item("three").click(); await tick();
    expect(item("three").getAttribute("aria-expanded")).toBe("true");
    expect(item("one").getAttribute("aria-expanded")).toBe("false");
  });
});
