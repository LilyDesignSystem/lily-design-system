// scroller-video.test.js
// ScrollerVideo component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.scroller-video");


describe("ScrollerVideo", () => {
  it("renders the element with its base class", async () => {
    await mount("scroller-video");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("scroller-video")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("scroller-video");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
