import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("mockup-tablet-portrait", () => {
  it("renders a <figure> with the base class", () => {
    const { document } = render("mockup-tablet-portrait", {});
    expect(document.querySelector("figure.mockup-tablet-portrait")).toBeTruthy();
  });

  it("renders a chrome bar with aria-hidden", () => {
    const { document } = render("mockup-tablet-portrait", { title: "x" });
    const chrome = document.querySelector(".mockup-tablet-portrait-chrome");
    expect(chrome).toBeTruthy();
    expect(chrome.getAttribute("aria-hidden")).toBe("true");
  });

  it("renders the title when provided", () => {
    const { document } = render("mockup-tablet-portrait", { title: "Preview" });
    expect(document.querySelector(".mockup-tablet-portrait-title").textContent.trim())
      .toBe("Preview");
  });

  it("renders caller content in the body", () => {
    const { document } = render("mockup-tablet-portrait", {}, '<div class="content"></div>');
    expect(document.querySelector(".mockup-tablet-portrait-body .content")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("mockup-tablet-portrait", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
