import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("tour", () => {
  it("renders a <section> with the base class and default aria-label", () => {
    const { document } = render("tour", {});
    const el = document.querySelector("section.tour");
    expect(el).toBeTruthy();
    expect(el.getAttribute("aria-label")).toBe("Tour");
  });

  it("respects params.label and labelledBy", () => {
    const { document: a } = render("tour", { label: "Welcome tour" });
    expect(a.querySelector("section").getAttribute("aria-label"))
      .toBe("Welcome tour");

    const { document: b } = render("tour", { label: "x", labelledBy: "h" });
    expect(b.querySelector("section").getAttribute("aria-labelledby")).toBe("h");
    expect(b.querySelector("section").hasAttribute("aria-label")).toBe(false);
  });

  it("renders caller content", () => {
    const { document } = render("tour", {}, '<ol class="tour-list"></ol>');
    expect(document.querySelector("section.tour ol.tour-list")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("tour", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
