// malta-national-identification-number-input.test.js
// MaltaNationalIdentificationNumberInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.malta-national-identification-number-input");


describe("MaltaNationalIdentificationNumberInput", () => {
  it("renders the element with its base class", async () => {
    await mount("malta-national-identification-number-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("malta-national-identification-number-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("malta-national-identification-number-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
