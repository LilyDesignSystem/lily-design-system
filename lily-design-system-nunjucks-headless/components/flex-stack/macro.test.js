import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("flex-stack", () => {
  it("renders a <div> with the base class and default direction/gap", () => {
    const { document } = render("flex-stack", {});
    const el = document.querySelector("div.flex-stack");
    expect(el).toBeTruthy();
    expect(el.getAttribute("data-direction")).toBe("column");
    const style = el.getAttribute("style");
    expect(style).toContain("display: flex");
    expect(style).toContain("flex-direction: column");
    expect(style).toContain("gap: 1rem");
  });

  it("respects custom direction and gap", () => {
    const { document } = render("flex-stack", {
      direction: "row",
      gap: "0.5rem",
    });
    const el = document.querySelector("div.flex-stack");
    expect(el.getAttribute("data-direction")).toBe("row");
    const style = el.getAttribute("style");
    expect(style).toContain("flex-direction: row");
    expect(style).toContain("gap: 0.5rem");
  });

  it("includes align-items and justify-content when provided", () => {
    const { document } = render("flex-stack", {
      align: "center",
      justify: "space-between",
    });
    const style = document.querySelector("div.flex-stack").getAttribute("style");
    expect(style).toContain("align-items: center");
    expect(style).toContain("justify-content: space-between");
  });

  it("omits align-items when not provided", () => {
    const { document } = render("flex-stack", {});
    const style = document.querySelector("div.flex-stack").getAttribute("style");
    expect(style).not.toContain("align-items");
  });

  it("renders caller content", () => {
    const { document } = render("flex-stack", {}, "<span>A</span>");
    expect(document.querySelector("div.flex-stack span")).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("flex-stack", { classes: "tight" });
    expect(document.querySelector("div.flex-stack.tight")).toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render("flex-stack", {
      attributes: { "data-test": "x" },
    });
    expect(document.querySelector("div.flex-stack").getAttribute("data-test"))
      .toBe("x");
  });

  it("contains no <script> tag", () => {
    const { html } = render("flex-stack", {});
    expect(html).not.toContain("<script");
  });
});
