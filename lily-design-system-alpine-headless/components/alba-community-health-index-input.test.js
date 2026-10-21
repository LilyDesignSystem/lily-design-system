// alba-community-health-index-input.test.js
// AlbaCommunityHealthIndexInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.alba-community-health-index-input");


describe("AlbaCommunityHealthIndexInput", () => {
  it("renders the element with its base class", async () => {
    await mount("alba-community-health-index-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("alba-community-health-index-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("alba-community-health-index-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
