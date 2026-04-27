import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("masonry", () => {
  it("renders a <div> with the base class and default columns/gap", () => {
    const { document } = render("masonry", {});
    const el = document.querySelector("div.masonry");
    expect(el).toBeTruthy();
    expect(el.getAttribute("data-columns")).toBe("3");
    const style = el.getAttribute("style");
    expect(style).toContain("column-count: 3");
    expect(style).toContain("column-gap: 1rem");
  });

  it("respects a custom columns value", () => {
    const { document } = render("masonry", { columns: 5 });
    const el = document.querySelector("div.masonry");
    expect(el.getAttribute("data-columns")).toBe("5");
    expect(el.getAttribute("style")).toContain("column-count: 5");
  });

  it("respects a custom gap", () => {
    const { document } = render("masonry", { gap: "2rem" });
    expect(document.querySelector("div.masonry").getAttribute("style"))
      .toContain("column-gap: 2rem");
  });

  it("renders caller content", () => {
    const { document } = render(
      "masonry",
      {},
      "<article>Item</article>",
    );
    expect(document.querySelector("div.masonry article")).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("masonry", { classes: "tight" });
    expect(document.querySelector("div.masonry.tight")).toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render("masonry", {
      attributes: { "data-test": "x" },
    });
    expect(document.querySelector("div.masonry").getAttribute("data-test"))
      .toBe("x");
  });

  it("contains no <script> tag", () => {
    const { html } = render("masonry", {});
    expect(html).not.toContain("<script");
  });
});
