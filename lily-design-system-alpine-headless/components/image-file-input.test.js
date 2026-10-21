// image-file-input.test.js
// ImageFileInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.image-file-input");


describe("ImageFileInput", () => {
  it("renders the element with its base class", async () => {
    await mount("image-file-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("image-file-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("image-file-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
