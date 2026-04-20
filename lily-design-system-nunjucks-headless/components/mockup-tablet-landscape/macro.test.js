import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("mockup-tablet-landscape", () => {
  it("renders a <figure> with the base class", () => {
    const { document } = render("mockup-tablet-landscape", {});
    expect(document.querySelector("figure.mockup-tablet-landscape")).toBeTruthy();
  });

  it("renders a chrome bar with aria-hidden", () => {
    const { document } = render("mockup-tablet-landscape", { title: "x" });
    const chrome = document.querySelector(".mockup-tablet-landscape-chrome");
    expect(chrome).toBeTruthy();
    expect(chrome.getAttribute("aria-hidden")).toBe("true");
  });

  it("renders the title when provided", () => {
    const { document } = render("mockup-tablet-landscape", { title: "Preview" });
    expect(document.querySelector(".mockup-tablet-landscape-title").textContent.trim())
      .toBe("Preview");
  });

  it("renders caller content in the body", () => {
    const { document } = render("mockup-tablet-landscape", {}, '<div class="content"></div>');
    expect(document.querySelector(".mockup-tablet-landscape-body .content")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("mockup-tablet-landscape", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
