// slider-button.test.js
// SliderButton component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("button.slider-button");


describe("SliderButton", () => {
  it("renders the element with its base class", async () => {
    await mount("slider-button");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("slider-button")).toBe(true);
  });

  it("uses the button element", async () => {
    await mount("slider-button");
    expect(el().tagName.toLowerCase()).toBe("button");
  });
});
