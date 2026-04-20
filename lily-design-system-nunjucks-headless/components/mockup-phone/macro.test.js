import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("mockup-phone", () => {
  it("renders a <figure> with the base class", () => {
    const { document } = render("mockup-phone", {});
    expect(document.querySelector("figure.mockup-phone")).toBeTruthy();
  });

  it("renders a chrome bar with aria-hidden", () => {
    const { document } = render("mockup-phone", { title: "x" });
    const chrome = document.querySelector(".mockup-phone-chrome");
    expect(chrome).toBeTruthy();
    expect(chrome.getAttribute("aria-hidden")).toBe("true");
  });

  it("renders the title when provided", () => {
    const { document } = render("mockup-phone", { title: "Preview" });
    expect(document.querySelector(".mockup-phone-title").textContent.trim())
      .toBe("Preview");
  });

  it("renders caller content in the body", () => {
    const { document } = render("mockup-phone", {}, '<div class="content"></div>');
    expect(document.querySelector(".mockup-phone-body .content")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("mockup-phone", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
