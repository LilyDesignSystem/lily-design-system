// image.test.js
// Image component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("img.image");


describe("Image", () => {
  it("renders the element with its base class", async () => {
    await mount("image");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("image")).toBe(true);
  });

  it("uses the img element", async () => {
    await mount("image");
    expect(el().tagName.toLowerCase()).toBe("img");
  });
});
