// horizontal-scroller.test.js
// HorizontalScroller component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.horizontal-scroller");


describe("HorizontalScroller", () => {
  it("renders the element with its base class", async () => {
    await mount("horizontal-scroller");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("horizontal-scroller")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("horizontal-scroller");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
