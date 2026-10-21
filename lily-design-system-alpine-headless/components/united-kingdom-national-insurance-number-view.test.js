// united-kingdom-national-insurance-number-view.test.js
// UnitedKingdomNationalInsuranceNumberView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.united-kingdom-national-insurance-number-view");


describe("UnitedKingdomNationalInsuranceNumberView", () => {
  it("renders the element with its base class", async () => {
    await mount("united-kingdom-national-insurance-number-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("united-kingdom-national-insurance-number-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("united-kingdom-national-insurance-number-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
