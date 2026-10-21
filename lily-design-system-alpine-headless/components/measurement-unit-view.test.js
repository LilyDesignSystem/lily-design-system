// measurement-unit-view.test.js
// MeasurementUnitView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.measurement-unit-view");


describe("MeasurementUnitView", () => {
  it("renders the element with its base class", async () => {
    await mount("measurement-unit-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("measurement-unit-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("measurement-unit-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
