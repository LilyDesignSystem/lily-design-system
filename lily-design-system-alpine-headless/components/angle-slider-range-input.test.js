// angle-slider-range-input.test.js
// AngleSliderRangeInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.angle-slider-range-input");


describe("AngleSliderRangeInput", () => {
  it("renders the element with its base class", async () => {
    await mount("angle-slider-range-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("angle-slider-range-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("angle-slider-range-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
