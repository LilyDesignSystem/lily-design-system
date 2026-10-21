// watermark.test.js
// Watermark component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.watermark");


describe("Watermark", () => {
  it("renders the element with its base class", async () => {
    await mount("watermark");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("watermark")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("watermark");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
