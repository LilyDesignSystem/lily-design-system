// tuaisceart-eireann-health-and-care-number-input.test.js
// TuaisceartEireannHealthAndCareNumberInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.tuaisceart-eireann-health-and-care-number-input");


describe("TuaisceartEireannHealthAndCareNumberInput", () => {
  it("renders the element with its base class", async () => {
    await mount("tuaisceart-eireann-health-and-care-number-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("tuaisceart-eireann-health-and-care-number-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("tuaisceart-eireann-health-and-care-number-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
