import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("image-input", () => {
  it("renders an <input type=image> with src and alt", () => {
    const { document } = render("image-input", {
      src: "/go.png",
      alt: "Go",
    });
    const el = document.querySelector("input.image-input");
    expect(el).toBeTruthy();
    expect(el.getAttribute("type")).toBe("image");
    expect(el.getAttribute("src")).toBe("/go.png");
    expect(el.getAttribute("alt")).toBe("Go");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("image-input", { src: "x", alt: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
