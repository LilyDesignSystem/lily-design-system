// aspect-ratio-container.test.js
// AspectRatioContainer component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.aspect-ratio-container");


describe("AspectRatioContainer", () => {
  it("renders the element with its base class", async () => {
    await mount("aspect-ratio-container");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("aspect-ratio-container")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("aspect-ratio-container");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
