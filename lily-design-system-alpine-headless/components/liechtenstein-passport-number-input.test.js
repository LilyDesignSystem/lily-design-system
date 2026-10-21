// liechtenstein-passport-number-input.test.js
// LiechtensteinPassportNumberInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.liechtenstein-passport-number-input");


describe("LiechtensteinPassportNumberInput", () => {
  it("renders the element with its base class", async () => {
    await mount("liechtenstein-passport-number-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("liechtenstein-passport-number-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("liechtenstein-passport-number-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
