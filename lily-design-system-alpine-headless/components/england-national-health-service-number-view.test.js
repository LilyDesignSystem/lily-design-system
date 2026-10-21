// england-national-health-service-number-view.test.js
// EnglandNationalHealthServiceNumberView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.england-national-health-service-number-view");


describe("EnglandNationalHealthServiceNumberView", () => {
  it("renders the element with its base class", async () => {
    await mount("england-national-health-service-number-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("england-national-health-service-number-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("england-national-health-service-number-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
