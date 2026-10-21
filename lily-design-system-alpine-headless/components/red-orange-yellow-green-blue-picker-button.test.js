// red-orange-yellow-green-blue-picker-button.test.js
// RedOrangeYellowGreenBluePickerButton component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("button.red-orange-yellow-green-blue-picker-button");


describe("RedOrangeYellowGreenBluePickerButton", () => {
  it("renders the element with its base class", async () => {
    await mount("red-orange-yellow-green-blue-picker-button");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("red-orange-yellow-green-blue-picker-button")).toBe(true);
  });

  it("uses the button element", async () => {
    await mount("red-orange-yellow-green-blue-picker-button");
    expect(el().tagName.toLowerCase()).toBe("button");
  });
});
