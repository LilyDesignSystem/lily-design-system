// file-tree.test.js
// FileTree component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("ul.file-tree");
const press = async (target, key, init = {}) => {
  target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init }));
  await tick();
};
const item = (id) => document.querySelector('[data-item="' + id + '"]');
const items = () => [...document.querySelectorAll('[role="treeitem"]')];
const name = (id, text) => item(id).prepend(text);
const nameAll = () => Object.entries({ one: "Fruit", "one-a": "Apple", "one-b": "Berry", two: "Tea", three: "Veg", "three-a": "Kale" }).forEach(([id, t]) => name(id, t));

describe("FileTree", () => {
  it("renders the element with its base class", async () => {
    await mount("file-tree");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("file-tree")).toBe(true);
  });

  it("starts with src and lib open and one tab stop", async () => {
    await mount("file-tree");
    expect(el().getAttribute("role")).toBe("tree");
    expect(["src", "lib", "docs", "etc"].map((id) => item(id).getAttribute("aria-expanded"))).toEqual(["true", "true", "false", "false"]);
    expect(items().filter((i) => i.getAttribute("tabindex") === "0")).toEqual([item("src")]);
  });
  it("ArrowDown walks the visible items only", async () => {
    await mount("file-tree");
    item("src").focus();
    const order = [];
    for (let k = 0; k < 6; k++) { await press(document.activeElement, "ArrowDown"); order.push(document.activeElement.dataset.item); }
    expect(order).toEqual(["lib", "index", "app", "docs", "readme", "etc"]);
    await press(item("etc"), "ArrowDown");
    expect(document.activeElement).toBe(item("etc"));
  });
  it("ArrowLeft closes a folder, then climbs to its parent", async () => {
    await mount("file-tree");
    item("lib").focus();
    await press(item("lib"), "ArrowLeft");
    expect(item("lib").getAttribute("aria-expanded")).toBe("false");
    await press(item("lib"), "ArrowLeft");
    expect(document.activeElement).toBe(item("src"));
  });
  it("typeahead uses each item's own text, not its children's", async () => {
    await mount("file-tree");
    item("src").focus();
    await press(item("src"), "r");
    expect(document.activeElement).toBe(item("readme"));
  });
  it("* opens the closed folders at the focused level", async () => {
    await mount("file-tree");
    item("docs").focus();
    await press(item("docs"), "*");
    expect(["docs", "etc"].map((id) => item(id).getAttribute("aria-expanded"))).toEqual(["true", "true"]);
  });
});
