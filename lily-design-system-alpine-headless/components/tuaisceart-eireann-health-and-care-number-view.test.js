// tuaisceart-eireann-health-and-care-number-view.test.js
// TuaisceartEireannHealthAndCareNumberView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.tuaisceart-eireann-health-and-care-number-view");


describe("TuaisceartEireannHealthAndCareNumberView", () => {
  it("renders the element with its base class", async () => {
    await mount("tuaisceart-eireann-health-and-care-number-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("tuaisceart-eireann-health-and-care-number-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("tuaisceart-eireann-health-and-care-number-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
