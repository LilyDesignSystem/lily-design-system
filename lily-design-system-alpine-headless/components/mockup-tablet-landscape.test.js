// mockup-tablet-landscape.test.js
// MockupTabletLandscape component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.mockup-tablet-landscape");


describe("MockupTabletLandscape", () => {
  it("renders the element with its base class", async () => {
    await mount("mockup-tablet-landscape");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("mockup-tablet-landscape")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("mockup-tablet-landscape");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
