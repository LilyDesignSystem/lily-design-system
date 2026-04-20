import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("tree-list", () => {
  it("renders a <ul role=tree> at the root", () => {
    const { document } = render("tree-list", { label: "Files" });
    const el = document.querySelector("ul.tree-list");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("tree");
    expect(el.getAttribute("aria-label")).toBe("Files");
  });

  it("renders a <ul role=group> when nested", () => {
    const { document } = render("tree-list", { nested: true });
    const el = document.querySelector("ul.tree-list");
    expect(el.getAttribute("role")).toBe("group");
  });

  it("omits aria-label on nested lists", () => {
    const { document } = render("tree-list", { nested: true, label: "Files" });
    expect(document.querySelector("ul").hasAttribute("aria-label")).toBe(false);
  });

  it("renders caller content", () => {
    const { document } = render(
      "tree-list",
      {},
      '<li role="treeitem" class="tree-list-item"></li>',
    );
    expect(
      document.querySelector("ul.tree-list li.tree-list-item"),
    ).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("tree-list", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
