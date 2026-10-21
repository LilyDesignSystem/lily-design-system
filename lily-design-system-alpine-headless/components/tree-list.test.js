// tree-list.test.js
// TreeList component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("ol.tree-list");


describe("TreeList", () => {
  it("renders the element with its base class", async () => {
    await mount("tree-list");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("tree-list")).toBe(true);
  });

  it("uses the ol element", async () => {
    await mount("tree-list");
    expect(el().tagName.toLowerCase()).toBe("ol");
  });
});
