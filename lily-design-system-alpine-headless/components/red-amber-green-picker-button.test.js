// red-amber-green-picker-button.test.js
// RedAmberGreenPickerButton component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("button.red-amber-green-picker-button");


describe("RedAmberGreenPickerButton", () => {
  it("renders the element with its base class", async () => {
    await mount("red-amber-green-picker-button");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("red-amber-green-picker-button")).toBe(true);
  });

  it("uses the button element", async () => {
    await mount("red-amber-green-picker-button");
    expect(el().tagName.toLowerCase()).toBe("button");
  });
});
