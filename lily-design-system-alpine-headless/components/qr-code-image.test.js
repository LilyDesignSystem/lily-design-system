// qr-code-image.test.js
// QrCodeImage component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.qr-code-image");


describe("QrCodeImage", () => {
  it("renders the element with its base class", async () => {
    await mount("qr-code-image");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("qr-code-image")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("qr-code-image");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
