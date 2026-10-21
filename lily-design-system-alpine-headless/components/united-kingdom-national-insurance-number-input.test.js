// united-kingdom-national-insurance-number-input.test.js
// UnitedKingdomNationalInsuranceNumberInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.united-kingdom-national-insurance-number-input");


describe("UnitedKingdomNationalInsuranceNumberInput", () => {
  it("renders the element with its base class", async () => {
    await mount("united-kingdom-national-insurance-number-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("united-kingdom-national-insurance-number-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("united-kingdom-national-insurance-number-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
