// government-banner.test.js
// GovernmentBanner component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("aside.government-banner");


describe("GovernmentBanner", () => {
  it("renders the element with its base class", async () => {
    await mount("government-banner");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("government-banner")).toBe(true);
  });

  it("shows the details only when the toggle is expanded", async () => {
    await mount("government-banner");
    const t = document.querySelector(".government-banner-toggle"), d = document.querySelector(".government-banner-details");
    expect(t.getAttribute("aria-controls")).toBe(d.id);
    expect(d.hidden).toBe(true);
    t.click(); await tick();
    expect(t.getAttribute("aria-expanded")).toBe("true");
    expect(d.hidden).toBe(false);
  });
});
