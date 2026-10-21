// united-kingdom-national-health-service-number-input.test.js
// UnitedKingdomNationalHealthServiceNumberInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.united-kingdom-national-health-service-number-input");


describe("UnitedKingdomNationalHealthServiceNumberInput", () => {
  it("renders the element with its base class", async () => {
    await mount("united-kingdom-national-health-service-number-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("united-kingdom-national-health-service-number-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("united-kingdom-national-health-service-number-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
