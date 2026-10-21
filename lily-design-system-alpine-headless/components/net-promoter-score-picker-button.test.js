// net-promoter-score-picker-button.test.js
// NetPromoterScorePickerButton component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("button.net-promoter-score-picker-button");


describe("NetPromoterScorePickerButton", () => {
  it("renders the element with its base class", async () => {
    await mount("net-promoter-score-picker-button");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("net-promoter-score-picker-button")).toBe(true);
  });

  it("uses the button element", async () => {
    await mount("net-promoter-score-picker-button");
    expect(el().tagName.toLowerCase()).toBe("button");
  });
});
