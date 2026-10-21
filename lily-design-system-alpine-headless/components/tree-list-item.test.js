// tree-list-item.test.js
// TreeListItem component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("li.tree-list-item");


describe("TreeListItem", () => {
  it("renders the element with its base class", async () => {
    await mount("tree-list-item");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("tree-list-item")).toBe(true);
  });

  it("uses the li element", async () => {
    await mount("tree-list-item");
    expect(el().tagName.toLowerCase()).toBe("li");
  });
});
