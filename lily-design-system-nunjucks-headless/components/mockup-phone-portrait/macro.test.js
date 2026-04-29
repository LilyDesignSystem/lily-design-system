import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("mockup-phone-portrait", () => {
  it("renders a <figure> with the base class", () => {
    const { document } = render("mockup-phone-portrait", {});
    expect(document.querySelector("figure.mockup-phone-portrait")).toBeTruthy();
  });

  it("renders a chrome bar with aria-hidden", () => {
    const { document } = render("mockup-phone-portrait", { title: "x" });
    const chrome = document.querySelector(".mockup-phone-chrome");
    expect(chrome).toBeTruthy();
    expect(chrome.getAttribute("aria-hidden")).toBe("true");
  });

  it("renders the title when provided", () => {
    const { document } = render("mockup-phone-portrait", { title: "Preview" });
    expect(document.querySelector(".mockup-phone-title").textContent.trim())
      .toBe("Preview");
  });

  it("renders caller content in the body", () => {
    const { document } = render("mockup-phone-portrait", {}, '<div class="content"></div>');
    expect(document.querySelector(".mockup-phone-body .content")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("mockup-phone-portrait", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
