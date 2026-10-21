// color-input.test.js
// ColorInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.color-input");


describe("ColorInput", () => {
  it("renders the element with its base class", async () => {
    await mount("color-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("color-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("color-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
