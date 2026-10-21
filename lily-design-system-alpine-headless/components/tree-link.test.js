// tree-link.test.js
// TreeLink component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("a.tree-link");


describe("TreeLink", () => {
  it("renders the element with its base class", async () => {
    await mount("tree-link");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("tree-link")).toBe(true);
  });

  it("uses the a element", async () => {
    await mount("tree-link");
    expect(el().tagName.toLowerCase()).toBe("a");
  });
});
