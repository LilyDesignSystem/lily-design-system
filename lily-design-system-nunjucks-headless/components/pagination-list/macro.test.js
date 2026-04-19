import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("pagination-list", () => {
  it("renders an <ol> with the base class", () => {
    const { document } = render("pagination-list", {});
    expect(document.querySelector("ol.pagination-list")).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("pagination-list", { classes: "compact" });
    expect(document.querySelector("ol.pagination-list.compact")).toBeTruthy();
  });

  it("renders caller block content", () => {
    const { document } = render(
      "pagination-list",
      {},
      '<li class="pagination-list-item">1</li>',
    );
    expect(document.querySelector("ol li.pagination-list-item")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("pagination-list", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
