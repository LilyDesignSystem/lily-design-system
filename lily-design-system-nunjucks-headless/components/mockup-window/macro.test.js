import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("mockup-window", () => {
  it("renders a <figure> with the base class", () => {
    const { document } = render("mockup-window", {});
    expect(document.querySelector("figure.mockup-window")).toBeTruthy();
  });

  it("renders a chrome bar with aria-hidden", () => {
    const { document } = render("mockup-window", { title: "x" });
    const chrome = document.querySelector(".mockup-window-chrome");
    expect(chrome).toBeTruthy();
    expect(chrome.getAttribute("aria-hidden")).toBe("true");
  });

  it("renders the title when provided", () => {
    const { document } = render("mockup-window", { title: "Preview" });
    expect(document.querySelector(".mockup-window-title").textContent.trim())
      .toBe("Preview");
  });

  it("renders caller content in the body", () => {
    const { document } = render("mockup-window", {}, '<div class="content"></div>');
    expect(document.querySelector(".mockup-window-body .content")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("mockup-window", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
