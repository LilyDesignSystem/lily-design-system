import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("pagination-nav", () => {
  it("renders a <nav> with the base class", () => {
    const { document } = render("pagination-nav", {});
    expect(document.querySelector("nav.pagination-nav")).toBeTruthy();
  });

  it("defaults aria-label to 'Pagination'", () => {
    const { document } = render("pagination-nav", {});
    expect(document.querySelector("nav").getAttribute("aria-label"))
      .toBe("Pagination");
  });

  it("respects a custom label", () => {
    const { document } = render("pagination-nav", { label: "Results pages" });
    expect(document.querySelector("nav").getAttribute("aria-label"))
      .toBe("Results pages");
  });

  it("prefers aria-labelledby over aria-label", () => {
    const { document } = render("pagination-nav", { labelledBy: "h" });
    const el = document.querySelector("nav");
    expect(el.getAttribute("aria-labelledby")).toBe("h");
    expect(el.hasAttribute("aria-label")).toBe(false);
  });

  it("appends params.classes", () => {
    const { document } = render("pagination-nav", { classes: "wide" });
    expect(document.querySelector("nav.pagination-nav.wide")).toBeTruthy();
  });

  it("renders caller block content", () => {
    const { document } = render(
      "pagination-nav",
      {},
      '<ol class="pagination-list"><li>x</li></ol>',
    );
    expect(document.querySelector("nav ol.pagination-list")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("pagination-nav", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
