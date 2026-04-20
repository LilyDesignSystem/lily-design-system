import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("accordion-list", () => {
  it("renders an <ol> with the base class", () => {
    const { document } = render("accordion-list", {});
    const el = document.querySelector("ol.accordion-list");
    expect(el).toBeTruthy();
  });

  it("renders caller block content", () => {
    const { document } = render(
      "accordion-list",
      {},
      '<li class="accordion-list-item"></li>',
    );
    expect(document.querySelector("ol.accordion-list li.accordion-list-item"))
      .toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("accordion-list", { classes: "bordered" });
    expect(document.querySelector("ol.accordion-list.bordered")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("accordion-list", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
