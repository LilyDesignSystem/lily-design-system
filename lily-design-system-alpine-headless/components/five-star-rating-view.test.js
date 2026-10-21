// five-star-rating-view.test.js
// FiveStarRatingView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.five-star-rating-view");


describe("FiveStarRatingView", () => {
  it("renders the element with its base class", async () => {
    await mount("five-star-rating-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("five-star-rating-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("five-star-rating-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
