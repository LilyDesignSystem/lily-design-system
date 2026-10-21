// canada-social-insurance-number-view.test.js
// CanadaSocialInsuranceNumberView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.canada-social-insurance-number-view");


describe("CanadaSocialInsuranceNumberView", () => {
  it("renders the element with its base class", async () => {
    await mount("canada-social-insurance-number-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("canada-social-insurance-number-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("canada-social-insurance-number-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
