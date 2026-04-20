import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("digital-object-identifier-link", () => {
  it("renders an <a> pointing at the DOI resolver", () => {
    const { document } = render("digital-object-identifier-link", {
      doi: "10.1000/xyz123",
    });
    const el = document.querySelector("a.digital-object-identifier-link");
    expect(el).toBeTruthy();
    expect(el.getAttribute("href")).toBe("https://doi.org/10.1000/xyz123");
    expect(el.getAttribute("rel")).toBe("noopener");
  });

  it("defaults text to 'doi: {doi}'", () => {
    const { document } = render("digital-object-identifier-link", {
      doi: "10.1000/xyz",
    });
    expect(document.querySelector("a").textContent.trim()).toBe("doi: 10.1000/xyz");
  });

  it("respects a custom base resolver", () => {
    const { document } = render("digital-object-identifier-link", {
      doi: "x",
      base: "https://dx.example.com/",
    });
    expect(document.querySelector("a").getAttribute("href"))
      .toBe("https://dx.example.com/x");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("digital-object-identifier-link", { doi: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
