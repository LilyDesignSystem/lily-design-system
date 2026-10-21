// mockup-phone-landscape.test.js
// MockupPhoneLandscape component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.mockup-phone-landscape");


describe("MockupPhoneLandscape", () => {
  it("renders the element with its base class", async () => {
    await mount("mockup-phone-landscape");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("mockup-phone-landscape")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("mockup-phone-landscape");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
