// five-face-rating-picker.test.js
// FiveFaceRatingPicker component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("fieldset.five-face-rating-picker");


describe("FiveFaceRatingPicker", () => {
  it("renders the element with its base class", async () => {
    await mount("five-face-rating-picker");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("five-face-rating-picker")).toBe(true);
  });

  const radios = () => [...document.querySelectorAll("input[type=radio]")];
  it("renders 5 native radios that share one name", async () => {
    await mount("five-face-rating-picker");
    expect(el().getAttribute("role")).toBe("radiogroup");
    expect(radios()).toHaveLength(5);
    expect(new Set(radios().map((r) => r.name))).toEqual(new Set(["satisfaction"]));
    expect(radios().every((r) => !r.checked)).toBe(true);
  });
  it("choosing a radio unchecks the others and updates data-value", async () => {
    await mount("five-face-rating-picker");
    radios()[2].click(); await tick();
    expect(radios().map((r) => r.checked)).toEqual(radios().map((_, i) => i === 2));
    expect(el().getAttribute("data-value")).toBe("3");
    radios()[0].click(); await tick();
    expect(el().getAttribute("data-value")).toBe("1");
  });
  it("a disabled fieldset disables every radio", async () => {
    await mount("five-face-rating-picker");
    el().disabled = true;
    expect(radios().every((r) => r.matches(":disabled"))).toBe(true);
  });
});
