import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("grail-layout-top-header", () => {
  it("renders a <header> with the base class", () => {
    const { document } = render("grail-layout-top-header", {});
    expect(document.querySelector("header.grail-layout-top-header")).toBeTruthy();
  });

  it("sets aria-label when provided", () => {
    const { document } = render("grail-layout-top-header", {
      label: "Site header",
    });
    expect(document.querySelector("header").getAttribute("aria-label"))
      .toBe("Site header");
  });

  it("prefers aria-labelledby over aria-label", () => {
    const { document } = render("grail-layout-top-header", {
      label: "x",
      labelledBy: "h",
    });
    const el = document.querySelector("header");
    expect(el.getAttribute("aria-labelledby")).toBe("h");
    expect(el.hasAttribute("aria-label")).toBe(false);
  });

  it("appends params.classes", () => {
    const { document } = render("grail-layout-top-header", {
      classes: "sticky",
    });
    expect(document.querySelector("header.grail-layout-top-header.sticky"))
      .toBeTruthy();
  });

  it("renders caller block content", () => {
    const { document } = render(
      "grail-layout-top-header",
      {},
      '<a href="/">Home</a>',
    );
    expect(document.querySelector("header a").textContent).toBe("Home");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("grail-layout-top-header", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
