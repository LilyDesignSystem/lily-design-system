import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("separator", () => {
  it("renders an <hr> by default", () => {
    const { document } = render("separator", {});
    const el = document.querySelector("hr.separator");
    expect(el).toBeTruthy();
    expect(el.getAttribute("data-orientation")).toBe("horizontal");
  });

  it("renders a vertical <div role=separator> when orientation is 'vertical'", () => {
    const { document } = render("separator", { orientation: "vertical" });
    const el = document.querySelector("div.separator");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("separator");
    expect(el.getAttribute("aria-orientation")).toBe("vertical");
    expect(el.getAttribute("data-orientation")).toBe("vertical");
  });

  it("sets aria-label when provided (horizontal)", () => {
    const { document } = render("separator", { label: "Section break" });
    expect(document.querySelector("hr").getAttribute("aria-label"))
      .toBe("Section break");
  });

  it("sets aria-label when provided (vertical)", () => {
    const { document } = render("separator", {
      orientation: "vertical",
      label: "Sidebar divider",
    });
    expect(document.querySelector("div.separator").getAttribute("aria-label"))
      .toBe("Sidebar divider");
  });

  it("appends params.classes", () => {
    const { document } = render("separator", { classes: "thick" });
    expect(document.querySelector("hr.separator.thick")).toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render("separator", {
      attributes: { "data-context": "section" },
    });
    expect(document.querySelector("hr").getAttribute("data-context"))
      .toBe("section");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("separator", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
