import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("avatar-image", () => {
  it("renders an <img> with the base class", () => {
    const { document } = render("avatar-image", { src: "/a.jpg" });
    const el = document.querySelector("img.avatar-image");
    expect(el).toBeTruthy();
    expect(el.getAttribute("src")).toBe("/a.jpg");
  });

  it("defaults alt to empty for Avatar composition", () => {
    const { document } = render("avatar-image", { src: "/a.jpg" });
    expect(document.querySelector("img").getAttribute("alt")).toBe("");
  });

  it("respects a custom alt", () => {
    const { document } = render("avatar-image", {
      src: "/a.jpg",
      alt: "Jane Smith",
    });
    expect(document.querySelector("img").getAttribute("alt")).toBe("Jane Smith");
  });

  it("defaults loading to 'lazy'", () => {
    const { document } = render("avatar-image", { src: "/a.jpg" });
    expect(document.querySelector("img").getAttribute("loading")).toBe("lazy");
  });

  it("renders width and height when provided", () => {
    const { document } = render("avatar-image", {
      src: "/a.jpg",
      width: 48,
      height: 48,
    });
    const el = document.querySelector("img");
    expect(el.getAttribute("width")).toBe("48");
    expect(el.getAttribute("height")).toBe("48");
  });

  it("appends params.classes", () => {
    const { document } = render("avatar-image", {
      src: "/a.jpg",
      classes: "large",
    });
    expect(document.querySelector("img.avatar-image.large")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("avatar-image", { src: "/a.jpg" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
