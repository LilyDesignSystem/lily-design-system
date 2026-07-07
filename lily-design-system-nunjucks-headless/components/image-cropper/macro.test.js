import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("image-cropper", () => {
  it("renders a <div> container with role and accessible name", () => {
    const { document } = render(
      "image-cropper",
      { label: "Crop your profile photo" },
      "<img src='photo.jpg' alt='Photo to crop'>",
    );
    const el = document.querySelector("div.image-cropper");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("application");
    expect(el.getAttribute("aria-label")).toBe("Crop your profile photo");
    expect(el.querySelector("img")).toBeTruthy();
  });

  it("contains no <script> tags", () => {
    const { html } = render("image-cropper", { label: "Image cropper" });
    expect(html).not.toContain("<script");
  });
});
