// image-cropper.test.js
// ImageCropper component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.image-cropper");


describe("ImageCropper", () => {
  it("renders the element with its base class", async () => {
    await mount("image-cropper");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("image-cropper")).toBe(true);
  });

  it('is role="application" with an accessible name', async () => {
    await mount("image-cropper");
    expect(el().getAttribute("role")).toBe("application");
    expect(el().hasAttribute("aria-label")).toBe(true);
  });
});
