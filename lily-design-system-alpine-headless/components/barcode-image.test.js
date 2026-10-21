// barcode-image.test.js
// BarcodeImage component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("img.barcode-image");


describe("BarcodeImage", () => {
  it("renders the element with its base class", async () => {
    await mount("barcode-image");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("barcode-image")).toBe(true);
  });

  it("uses the img element", async () => {
    await mount("barcode-image");
    expect(el().tagName.toLowerCase()).toBe("img");
  });
});
