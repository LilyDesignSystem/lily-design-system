import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

const items = '<li role="treeitem" aria-expanded="true" tabindex="0">src<ul role="group"><li role="treeitem" tabindex="-1">a.js</li></ul></li><li role="treeitem" tabindex="-1">README</li>';
const r = (x = {}) => render("file-tree", { label: "Files", ...x }, items).document;
describe("file-tree", () => {
  it("renders <ul role=tree> with the base class", () => {
    const el = r().querySelector("ul.file-tree");
    expect(el.getAttribute("role")).toBe("tree");
  });
  it("uses label as aria-label", () => {
    expect(r().querySelector(".file-tree").getAttribute("aria-label")).toBe("Files");
  });
  it("renders consumer treeitems and nested groups untouched", () => {
    const d = r();
    expect(d.querySelectorAll("[role=treeitem]").length).toBe(3);
    expect(d.querySelector("[role=group] [role=treeitem]")).toBeTruthy();
  });
  it("preserves exactly one tab stop from the markup", () => {
    expect(r().querySelectorAll("[tabindex='0']").length).toBe(1);
  });
  it("carries the data-module hook for consumer keyboard script", () => {
    expect(r().querySelector(".file-tree").getAttribute("data-module")).toBe("file-tree");
  });
  it("appends classes and spreads attributes on the root", () => {
    const el = r({ classes: "extra", attributes: { "data-x": "1" } }).querySelector(".file-tree");
    expect(el.classList.contains("extra")).toBe(true);
    expect(el.getAttribute("data-x")).toBe("1");
  });
  it("contains no <style> or <script> tags", () => {
    const { html } = render("file-tree", { label: "F" });
    expect(html).not.toMatch(/<(style|script)/);
  });
});
