// measurement-instance-input.test.js
// MeasurementInstanceInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.measurement-instance-input");


describe("MeasurementInstanceInput", () => {
  it("renders the element with its base class", async () => {
    await mount("measurement-instance-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("measurement-instance-input")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("measurement-instance-input");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
