// sticky-promo-banner.test.js
// StickyPromoBanner component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("aside.sticky-promo-banner");


describe("StickyPromoBanner", () => {
  it("renders the element with its base class", async () => {
    await mount("sticky-promo-banner");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("sticky-promo-banner")).toBe(true);
  });

  it("carries no inline style (position is consumer CSS)", async () => {
    await mount("sticky-promo-banner");
    expect(el().hasAttribute("style")).toBe(false);
    expect(el().getAttribute("data-position")).toBe("bottom");
  });
  it("hides when dismissed", async () => {
    await mount("sticky-promo-banner");
    document.querySelector(".sticky-promo-banner-dismiss").click(); await tick();
    expect(el().hidden).toBe(true);
  });
});
