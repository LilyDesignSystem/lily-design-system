import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("banner", () => {
  it("renders a <div> with the base class", () => {
    const { document } = render("banner", {});
    expect(document.querySelector("div.banner")).toBeTruthy();
  });

  it("sets role='region' and aria-label when label is provided", () => {
    const { document } = render("banner", { label: "Site banner" });
    const el = document.querySelector("div.banner");
    expect(el.getAttribute("role")).toBe("region");
    expect(el.getAttribute("aria-label")).toBe("Site banner");
  });

  it("omits role when no label is given", () => {
    const { document } = render("banner", {});
    expect(document.querySelector("div.banner").hasAttribute("role")).toBe(false);
  });

  it("prefers aria-labelledby over aria-label", () => {
    const { document } = render("banner", {
      label: "x",
      labelledBy: "h",
    });
    const el = document.querySelector("div.banner");
    expect(el.getAttribute("aria-labelledby")).toBe("h");
    expect(el.hasAttribute("aria-label")).toBe(false);
  });

  it("renders caller block content", () => {
    const { document } = render("banner", {}, "<strong>Hello</strong>");
    expect(document.querySelector("div.banner strong")).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("banner", { classes: "promo" });
    expect(document.querySelector("div.banner.promo")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("banner", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
