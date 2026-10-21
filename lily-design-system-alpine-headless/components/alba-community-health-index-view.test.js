// alba-community-health-index-view.test.js
// AlbaCommunityHealthIndexView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.alba-community-health-index-view");


describe("AlbaCommunityHealthIndexView", () => {
  it("renders the element with its base class", async () => {
    await mount("alba-community-health-index-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("alba-community-health-index-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("alba-community-health-index-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
