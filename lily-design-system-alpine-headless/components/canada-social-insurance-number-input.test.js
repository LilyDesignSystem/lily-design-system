// canada-social-insurance-number-input.test.js
// CanadaSocialInsuranceNumberInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.canada-social-insurance-number-input");


describe("CanadaSocialInsuranceNumberInput", () => {
  it("renders the element with its base class", async () => {
    await mount("canada-social-insurance-number-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("canada-social-insurance-number-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("canada-social-insurance-number-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
