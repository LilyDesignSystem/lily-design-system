import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("hamburger-menu", () => {
  it("renders a <button> with aria-expanded and aria-label", () => {
    const { document } = render("hamburger-menu", { controls: "nav" });
    const el = document.querySelector("button.hamburger-menu");
    expect(el).toBeTruthy();
    expect(el.getAttribute("aria-label")).toBe("Menu");
    expect(el.getAttribute("aria-controls")).toBe("nav");
    expect(el.getAttribute("aria-expanded")).toBe("false");
  });

  it("sets aria-expanded=true when expanded", () => {
    const { document } = render("hamburger-menu", { expanded: true });
    expect(document.querySelector("button").getAttribute("aria-expanded"))
      .toBe("true");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("hamburger-menu", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
