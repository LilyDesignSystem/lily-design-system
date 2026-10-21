// five-star-rating-picker-button.test.js
// FiveStarRatingPickerButton component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("button.five-star-rating-picker-button");


describe("FiveStarRatingPickerButton", () => {
  it("renders the element with its base class", async () => {
    await mount("five-star-rating-picker-button");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("five-star-rating-picker-button")).toBe(true);
  });

  it("uses the button element", async () => {
    await mount("five-star-rating-picker-button");
    expect(el().tagName.toLowerCase()).toBe("button");
  });
});
