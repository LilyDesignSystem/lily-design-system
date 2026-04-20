import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("mockup-laptop", () => {
  it("renders a <figure> with the base class", () => {
    const { document } = render("mockup-laptop", {});
    expect(document.querySelector("figure.mockup-laptop")).toBeTruthy();
  });

  it("renders a chrome bar with aria-hidden", () => {
    const { document } = render("mockup-laptop", { title: "x" });
    const chrome = document.querySelector(".mockup-laptop-chrome");
    expect(chrome).toBeTruthy();
    expect(chrome.getAttribute("aria-hidden")).toBe("true");
  });

  it("renders the title when provided", () => {
    const { document } = render("mockup-laptop", { title: "Preview" });
    expect(document.querySelector(".mockup-laptop-title").textContent.trim())
      .toBe("Preview");
  });

  it("renders caller content in the body", () => {
    const { document } = render("mockup-laptop", {}, '<div class="content"></div>');
    expect(document.querySelector(".mockup-laptop-body .content")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("mockup-laptop", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
