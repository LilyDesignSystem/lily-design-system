// measurement-system-input.test.js
// MeasurementSystemInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.measurement-system-input");


describe("MeasurementSystemInput", () => {
  it("renders the element with its base class", async () => {
    await mount("measurement-system-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("measurement-system-input")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("measurement-system-input");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
