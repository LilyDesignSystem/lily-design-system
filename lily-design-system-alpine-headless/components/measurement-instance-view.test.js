// measurement-instance-view.test.js
// MeasurementInstanceView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.measurement-instance-view");


describe("MeasurementInstanceView", () => {
  it("renders the element with its base class", async () => {
    await mount("measurement-instance-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("measurement-instance-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("measurement-instance-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
