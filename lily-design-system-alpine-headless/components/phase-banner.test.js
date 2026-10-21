// phase-banner.test.js
// PhaseBanner component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.phase-banner");


describe("PhaseBanner", () => {
  it("renders the element with its base class", async () => {
    await mount("phase-banner");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("phase-banner")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("phase-banner");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
