import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("tree-menu", () => {
  it("renders a <div role=tree> with the base class", () => {
    const { document } = render("tree-menu", { label: "Files" });
    const el = document.querySelector("div.tree-menu");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("tree");
    expect(el.getAttribute("aria-label")).toBe("Files");
  });

  it("defaults aria-label to 'Menu'", () => {
    const { document } = render("tree-menu", {});
    expect(document.querySelector("div.tree-menu").getAttribute("aria-label"))
      .toBe("Menu");
  });

  it("prefers labelledBy over label", () => {
    const { document } = render("tree-menu", { label: "x", labelledBy: "h" });
    const el = document.querySelector("div");
    expect(el.getAttribute("aria-labelledby")).toBe("h");
    expect(el.hasAttribute("aria-label")).toBe(false);
  });

  it("renders caller content", () => {
    const { document } = render(
      "tree-menu",
      {},
      '<li role="treeitem" class="tree-list-item"></li>',
    );
    expect(document.querySelector("div.tree-menu .tree-list-item")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("tree-menu", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
