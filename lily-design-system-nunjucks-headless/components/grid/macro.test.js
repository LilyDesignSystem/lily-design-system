import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("grid", () => {
  it("renders a <div> with the base class and default 12-column grid", () => {
    const { document } = render("grid", {});
    const el = document.querySelector("div.grid");
    expect(el).toBeTruthy();
    expect(el.getAttribute("data-columns")).toBe("12");
    const style = el.getAttribute("style");
    expect(style).toContain("display: grid");
    expect(style).toContain("grid-template-columns: repeat(12, minmax(0, 1fr))");
    expect(style).toContain("gap: 1rem");
  });

  it("respects a numeric columns prop", () => {
    const { document } = render("grid", { columns: 4 });
    const el = document.querySelector("div.grid");
    expect(el.getAttribute("data-columns")).toBe("4");
    expect(el.getAttribute("style"))
      .toContain("grid-template-columns: repeat(4, minmax(0, 1fr))");
  });

  it("respects a string columns prop verbatim", () => {
    const { document } = render("grid", {
      columns: "200px 1fr 200px",
    });
    const el = document.querySelector("div.grid");
    expect(el.getAttribute("style"))
      .toContain("grid-template-columns: 200px 1fr 200px");
  });

  it("respects a custom gap", () => {
    const { document } = render("grid", { gap: "2rem" });
    expect(document.querySelector("div.grid").getAttribute("style"))
      .toContain("gap: 2rem");
  });

  it("renders caller content", () => {
    const { document } = render("grid", {}, "<span>Cell</span>");
    expect(document.querySelector("div.grid span")).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("grid", { classes: "responsive" });
    expect(document.querySelector("div.grid.responsive")).toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render("grid", {
      attributes: { "data-test": "x" },
    });
    expect(document.querySelector("div.grid").getAttribute("data-test"))
      .toBe("x");
  });

  it("contains no <script> tag", () => {
    const { html } = render("grid", {});
    expect(html).not.toContain("<script");
  });

  it("minColumnWidth generates a fluid auto-fit template", () => {
    const { document } = render("grid", { minColumnWidth: "12rem" });
    const el = document.querySelector("div.grid");
    expect(el.getAttribute("data-min-column-width")).toBe("12rem");
    expect(el.getAttribute("style")).toContain(
      "grid-template-columns: repeat(auto-fit, minmax(min(12rem, 100%), 1fr))");
  });

  it("minColumnWidth wins over columns", () => {
    const { document } = render("grid", { columns: 3, minColumnWidth: "120px" });
    const style = document.querySelector("div.grid").getAttribute("style");
    expect(style).toContain("min(120px, 100%)");
    expect(style).not.toContain("repeat(3,");
  });

  it("omits data-min-column-width when unset", () => {
    const { document } = render("grid", {});
    expect(document.querySelector("div.grid").hasAttribute("data-min-column-width")).toBe(false);
  });
});
