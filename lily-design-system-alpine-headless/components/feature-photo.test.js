// feature-photo.test.js
// FeaturePhoto component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("figure.feature-photo");


describe("FeaturePhoto", () => {
  it("renders the element with its base class", async () => {
    await mount("feature-photo");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("feature-photo")).toBe(true);
  });

  it("uses the figure element", async () => {
    await mount("feature-photo");
    expect(el().tagName.toLowerCase()).toBe("figure");
  });
});
