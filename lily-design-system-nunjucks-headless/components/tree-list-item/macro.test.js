import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("tree-list-item", () => {
  it("renders an <li role=treeitem>", () => {
    const { document } = render("tree-list-item", { text: "Node" });
    const el = document.querySelector("li.tree-list-item");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("treeitem");
  });

  it("sets aria-expanded when expanded is provided", () => {
    const { document: open } = render("tree-list-item", {
      text: "x",
      expanded: true,
    });
    expect(open.querySelector("li").getAttribute("aria-expanded")).toBe("true");

    const { document: closed } = render("tree-list-item", {
      text: "x",
      expanded: false,
    });
    expect(closed.querySelector("li").getAttribute("aria-expanded")).toBe("false");
  });

  it("omits aria-expanded when not provided", () => {
    const { document } = render("tree-list-item", { text: "leaf" });
    expect(document.querySelector("li").hasAttribute("aria-expanded")).toBe(false);
  });

  it("sets data-current when current", () => {
    const { document } = render("tree-list-item", { text: "x", current: true });
    expect(document.querySelector("li").hasAttribute("data-current")).toBe(true);
  });

  it("sets aria-selected when selected", () => {
    const { document } = render("tree-list-item", { text: "x", selected: true });
    expect(document.querySelector("li").getAttribute("aria-selected"))
      .toBe("true");
  });

  it("sets aria-level from params.level", () => {
    const { document } = render("tree-list-item", { text: "x", level: 2 });
    expect(document.querySelector("li").getAttribute("aria-level")).toBe("2");
  });

  it("renders caller content", () => {
    const { document } = render(
      "tree-list-item",
      {},
      '<a class="tree-link">Home</a>',
    );
    expect(document.querySelector("li .tree-link")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("tree-list-item", { text: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });

  it("is focusable by script (tabindex=-1) so TreeList's arrow keys can reach it", () => {
    const { html } = render("tree-list-item", { text: "x" });
    expect(html).toContain('role="treeitem"');
    expect(html).toContain('tabindex="-1"');
  });

  it("a tabindex passed in attributes replaces the default rather than duplicating it", () => {
    const { html } = render("tree-list-item", { text: "x", attributes: { tabindex: "0" } });
    expect(html.match(/tabindex=/g)).toHaveLength(1);
    expect(html).toContain('tabindex="0"');
  });
});
