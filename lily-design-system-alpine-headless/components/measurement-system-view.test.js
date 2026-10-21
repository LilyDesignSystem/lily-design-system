// measurement-system-view.test.js
// MeasurementSystemView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.measurement-system-view");


describe("MeasurementSystemView", () => {
  it("renders the element with its base class", async () => {
    await mount("measurement-system-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("measurement-system-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("measurement-system-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
