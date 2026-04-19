import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("breadcrumb-nav", () => {
  it("renders a <nav> with the base class", () => {
    const { document } = render("breadcrumb-nav", {});
    const el = document.querySelector("nav");
    expect(el).toBeTruthy();
    expect(el.classList.contains("breadcrumb-nav")).toBe(true);
  });

  it("defaults aria-label to 'Breadcrumb'", () => {
    const { document } = render("breadcrumb-nav", {});
    expect(document.querySelector("nav").getAttribute("aria-label"))
      .toBe("Breadcrumb");
  });

  it("respects a custom label", () => {
    const { document } = render("breadcrumb-nav", { label: "You are here" });
    expect(document.querySelector("nav").getAttribute("aria-label"))
      .toBe("You are here");
  });

  it("uses aria-labelledby when provided instead of aria-label", () => {
    const { document } = render("breadcrumb-nav", { labelledBy: "h" });
    const nav = document.querySelector("nav");
    expect(nav.getAttribute("aria-labelledby")).toBe("h");
    expect(nav.hasAttribute("aria-label")).toBe(false);
  });

  it("appends params.classes", () => {
    const { document } = render("breadcrumb-nav", { classes: "extra" });
    expect(document.querySelector("nav.breadcrumb-nav.extra")).toBeTruthy();
  });

  it("renders caller block content", () => {
    const { document } = render("breadcrumb-nav", {}, "<ol><li>x</li></ol>");
    expect(document.querySelector("nav ol li")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("breadcrumb-nav", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
