import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("accordion-nav", () => {
  it("renders a <nav> with the base class and default aria-label", () => {
    const { document } = render("accordion-nav", {});
    const el = document.querySelector("nav.accordion-nav");
    expect(el).toBeTruthy();
    expect(el.getAttribute("aria-label")).toBe("Accordion");
  });

  it("respects params.label", () => {
    const { document } = render("accordion-nav", { label: "Help" });
    expect(document.querySelector("nav.accordion-nav").getAttribute("aria-label"))
      .toBe("Help");
  });

  it("prefers aria-labelledby over aria-label", () => {
    const { document } = render("accordion-nav", {
      label: "x",
      labelledBy: "h",
    });
    const el = document.querySelector("nav.accordion-nav");
    expect(el.getAttribute("aria-labelledby")).toBe("h");
    expect(el.hasAttribute("aria-label")).toBe(false);
  });

  it("renders caller block content", () => {
    const { document } = render(
      "accordion-nav",
      {},
      '<ol class="accordion-list"></ol>',
    );
    expect(document.querySelector("nav.accordion-nav ol.accordion-list")).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("accordion-nav", { classes: "boxed" });
    expect(document.querySelector("nav.accordion-nav.boxed")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("accordion-nav", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
