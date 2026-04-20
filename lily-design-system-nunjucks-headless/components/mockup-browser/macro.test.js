import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("mockup-browser", () => {
  it("renders a <figure> with the base class", () => {
    const { document } = render("mockup-browser", {});
    expect(document.querySelector("figure.mockup-browser")).toBeTruthy();
  });

  it("renders a chrome bar with aria-hidden", () => {
    const { document } = render("mockup-browser", { title: "x" });
    const chrome = document.querySelector(".mockup-browser-chrome");
    expect(chrome).toBeTruthy();
    expect(chrome.getAttribute("aria-hidden")).toBe("true");
  });

  it("renders the title when provided", () => {
    const { document } = render("mockup-browser", { title: "Preview" });
    expect(document.querySelector(".mockup-browser-title").textContent.trim())
      .toBe("Preview");
  });

  it("renders caller content in the body", () => {
    const { document } = render("mockup-browser", {}, '<div class="content"></div>');
    expect(document.querySelector(".mockup-browser-body .content")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("mockup-browser", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
