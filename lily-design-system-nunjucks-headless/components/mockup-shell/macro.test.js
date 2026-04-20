import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("mockup-shell", () => {
  it("renders a <figure> with the base class", () => {
    const { document } = render("mockup-shell", {});
    expect(document.querySelector("figure.mockup-shell")).toBeTruthy();
  });

  it("renders a chrome bar with aria-hidden", () => {
    const { document } = render("mockup-shell", { title: "x" });
    const chrome = document.querySelector(".mockup-shell-chrome");
    expect(chrome).toBeTruthy();
    expect(chrome.getAttribute("aria-hidden")).toBe("true");
  });

  it("renders the title when provided", () => {
    const { document } = render("mockup-shell", { title: "Preview" });
    expect(document.querySelector(".mockup-shell-title").textContent.trim())
      .toBe("Preview");
  });

  it("renders caller content in the body", () => {
    const { document } = render("mockup-shell", {}, '<div class="content"></div>');
    expect(document.querySelector(".mockup-shell-body .content")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("mockup-shell", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
