// five-face-rating-view.test.js
// FiveFaceRatingView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.five-face-rating-view");


describe("FiveFaceRatingView", () => {
  it("renders the element with its base class", async () => {
    await mount("five-face-rating-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("five-face-rating-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("five-face-rating-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
