// color-picker-button.test.js
// ColorPickerButton component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("button.color-picker-button");


describe("ColorPickerButton", () => {
  it("renders the element with its base class", async () => {
    await mount("color-picker-button");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("color-picker-button")).toBe(true);
  });

  it("uses the button element", async () => {
    await mount("color-picker-button");
    expect(el().tagName.toLowerCase()).toBe("button");
  });
});
