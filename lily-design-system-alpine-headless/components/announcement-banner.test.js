// announcement-banner.test.js
// AnnouncementBanner component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.announcement-banner");


describe("AnnouncementBanner", () => {
  it("renders the element with its base class", async () => {
    await mount("announcement-banner");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("announcement-banner")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("announcement-banner");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
