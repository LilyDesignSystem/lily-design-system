import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("barcode-image", () => {
  it("renders an <img> with the base class", () => {
    const { document } = render("barcode-image", { src: "/b.png", alt: "Order 123" });
    const el = document.querySelector("img.barcode-image");
    expect(el).toBeTruthy();
    expect(el.getAttribute("src")).toBe("/b.png");
    expect(el.getAttribute("alt")).toBe("Order 123");
  });

  it("applies loading attribute when provided", () => {
    const { document } = render("barcode-image", { src: "/b.png", alt: "x", loading: "lazy" });
    expect(document.querySelector("img.barcode-image").getAttribute("loading")).toBe("lazy");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("barcode-image", { src: "/b.png", alt: "y" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
