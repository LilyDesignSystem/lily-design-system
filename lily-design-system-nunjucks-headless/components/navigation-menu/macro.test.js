import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("navigation-menu", () => {
  it("renders a <nav> with default aria-label", () => {
    const { document } = render("navigation-menu", {});
    const el = document.querySelector("nav.navigation-menu");
    expect(el).toBeTruthy();
    expect(el.getAttribute("aria-label")).toBe("Site navigation");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("navigation-menu", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
