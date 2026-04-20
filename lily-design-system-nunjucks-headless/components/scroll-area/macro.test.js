import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("scroll-area", () => {
  it("renders a <div> with tabindex for keyboard scrolling", () => {
    const { document } = render("scroll-area", {});
    const el = document.querySelector("div.scroll-area");
    expect(el).toBeTruthy();
    expect(el.getAttribute("tabindex")).toBe("0");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("scroll-area", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
