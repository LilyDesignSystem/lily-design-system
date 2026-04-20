import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("image", () => {
  it("renders an <img> with src, alt, and lazy loading", () => {
    const { document } = render("image", {
      src: "/photo.jpg",
      alt: "A photo",
    });
    const el = document.querySelector("img.image");
    expect(el).toBeTruthy();
    expect(el.getAttribute("src")).toBe("/photo.jpg");
    expect(el.getAttribute("alt")).toBe("A photo");
    expect(el.getAttribute("loading")).toBe("lazy");
  });

  it("passes width and height", () => {
    const { document } = render("image", {
      src: "/x.jpg",
      alt: "x",
      width: 300,
      height: 200,
    });
    const el = document.querySelector("img");
    expect(el.getAttribute("width")).toBe("300");
    expect(el.getAttribute("height")).toBe("200");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("image", { src: "/x.jpg", alt: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
