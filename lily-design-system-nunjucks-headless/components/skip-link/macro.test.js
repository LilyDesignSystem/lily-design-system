import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("skip-link", () => {
  it("renders an <a> with the base class when called with no params", () => {
    const { document } = render("skip-link", {});
    const el = document.querySelector("a");
    expect(el).toBeTruthy();
    expect(el.classList.contains("skip-link")).toBe(true);
  });

  it("defaults href to '#main-content'", () => {
    const { document } = render("skip-link", {});
    expect(document.querySelector("a").getAttribute("href")).toBe("#main-content");
  });

  it("defaults text to 'Skip to main content'", () => {
    const { document } = render("skip-link", {});
    expect(document.querySelector("a").textContent.trim())
      .toBe("Skip to main content");
  });

  it("respects a custom href", () => {
    const { document } = render("skip-link", { href: "#content" });
    expect(document.querySelector("a").getAttribute("href")).toBe("#content");
  });

  it("respects a custom text", () => {
    const { document } = render("skip-link", { text: "Jump to content" });
    expect(document.querySelector("a").textContent.trim())
      .toBe("Jump to content");
  });

  it("renders params.html raw", () => {
    const { document } = render("skip-link", {
      html: "<strong>Skip</strong> to content",
    });
    expect(document.querySelector("a strong")).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("skip-link", { classes: "extra" });
    expect(document.querySelector("a.skip-link.extra")).toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render("skip-link", {
      attributes: { "data-module": "skip-link" },
    });
    expect(document.querySelector("a").getAttribute("data-module"))
      .toBe("skip-link");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("skip-link", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
