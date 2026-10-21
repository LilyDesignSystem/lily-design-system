// tree-nav.test.js
// TreeNav component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("nav.tree-nav");
const press = async (target, key, init = {}) => {
  target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init }));
  await tick();
};
const item = (id) => document.querySelector('[data-item="' + id + '"]');
const items = () => [...document.querySelectorAll('[role="treeitem"]')];
const name = (id, text) => item(id).prepend(text);
const nameAll = () => Object.entries({ one: "Fruit", "one-a": "Apple", "one-b": "Berry", two: "Tea", three: "Veg", "three-a": "Kale" }).forEach(([id, t]) => name(id, t));

describe("TreeNav", () => {
  it("renders the element with its base class", async () => {
    await mount("tree-nav");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("tree-nav")).toBe(true);
  });

  it("is a tree of treeitems with one tab stop and closed branches", async () => {
    await mount("tree-nav");
    expect(document.querySelector("[role=tree]")).not.toBeNull();
    expect(items().map((i) => i.getAttribute("role"))).toEqual(Array(6).fill("treeitem"));
    expect(items().map((i) => i.getAttribute("tabindex"))).toEqual(["0", "-1", "-1", "-1", "-1", "-1"]);
    expect(item("one").getAttribute("aria-expanded")).toBe("false");
    expect(item("two").hasAttribute("aria-expanded")).toBe(false);
    expect(item("one").querySelector("[role=group]").hidden).toBe(true);
  });
  it("ArrowRight opens a branch then enters it; ArrowLeft closes or goes to the parent", async () => {
    await mount("tree-nav");
    item("one").focus();
    await press(item("one"), "ArrowRight");
    expect(item("one").getAttribute("aria-expanded")).toBe("true");
    expect(item("one").querySelector("[role=group]").hidden).toBe(false);
    await press(item("one"), "ArrowRight");
    expect(document.activeElement).toBe(item("one-a"));
    await press(item("one-a"), "ArrowLeft");
    expect(document.activeElement).toBe(item("one"));
    await press(item("one"), "ArrowLeft");
    expect(item("one").getAttribute("aria-expanded")).toBe("false");
  });
  it("ArrowDown and ArrowUp skip the children of a closed branch", async () => {
    await mount("tree-nav");
    item("one").focus();
    await press(item("one"), "ArrowDown");
    expect(document.activeElement).toBe(item("two"));
    await press(item("two"), "ArrowUp");
    expect(document.activeElement).toBe(item("one"));
    expect(item("one").getAttribute("tabindex")).toBe("0");
    expect(item("two").getAttribute("tabindex")).toBe("-1");
  });
  it("the arrows stop at the ends; Home and End jump", async () => {
    await mount("tree-nav");
    item("one").focus();
    await press(item("one"), "ArrowUp");
    expect(document.activeElement).toBe(item("one"));
    await press(document.activeElement, "End");
    expect(document.activeElement).toBe(item("three"));
    await press(item("three"), "ArrowDown");
    expect(document.activeElement).toBe(item("three"));
    await press(document.activeElement, "End");
    await press(item("three"), "Home");
    expect(document.activeElement).toBe(item("one"));
  });
  it("* opens every closed branch at the focused level", async () => {
    await mount("tree-nav");
    item("one").focus();
    await press(item("one"), "*");
    expect(item("one").getAttribute("aria-expanded")).toBe("true");
    expect(item("three").getAttribute("aria-expanded")).toBe("true");
  });
  it("typing jumps to the next visible item starting with the character", async () => {
    await mount("tree-nav"); nameAll();
    item("one").focus();
    await press(item("one"), "t");
    expect(document.activeElement).toBe(item("two"));
  });
  it("Enter on a leaf selects it and announces its path; a click on a child does not toggle its parent", async () => {
    await mount("tree-nav");
    const seen = vi.fn();
    document.body.addEventListener("lily:select", (e) => seen(e.detail));
    item("one").click(); await tick();
    item("one-a").click(); await tick();
    expect(item("one").getAttribute("aria-expanded")).toBe("true");
    expect(item("one-a").getAttribute("aria-selected")).toBe("true");
    expect(seen).toHaveBeenLastCalledWith(expect.objectContaining({ selected: "one-a", path: ["one", "one-a"] }));
    item("two").focus();
    await press(item("two"), "Enter");
    expect(item("two").getAttribute("aria-selected")).toBe("true");
  });
});
