import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("tree-nav", () => {
  it("renders a <nav> with the base class and default aria-label", () => {
    const { document } = render("tree-nav", {});
    const el = document.querySelector("nav.tree-nav");
    expect(el).toBeTruthy();
    expect(el.getAttribute("aria-label")).toBe("Tree");
  });

  it("respects params.label and labelledBy", () => {
    const { document: a } = render("tree-nav", { label: "Sitemap" });
    expect(a.querySelector("nav").getAttribute("aria-label")).toBe("Sitemap");

    const { document: b } = render("tree-nav", { label: "x", labelledBy: "h" });
    expect(b.querySelector("nav").getAttribute("aria-labelledby")).toBe("h");
    expect(b.querySelector("nav").hasAttribute("aria-label")).toBe(false);
  });

  it("renders caller content", () => {
    const { document } = render(
      "tree-nav",
      {},
      '<ul class="tree-list" role="tree"></ul>',
    );
    expect(document.querySelector("nav.tree-nav ul.tree-list")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("tree-nav", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
