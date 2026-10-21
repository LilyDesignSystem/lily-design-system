// malta-passport-number-input.test.js
// MaltaPassportNumberInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.malta-passport-number-input");


describe("MaltaPassportNumberInput", () => {
  it("renders the element with its base class", async () => {
    await mount("malta-passport-number-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("malta-passport-number-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("malta-passport-number-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
