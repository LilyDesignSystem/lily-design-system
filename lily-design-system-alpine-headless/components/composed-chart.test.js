// composed-chart.test.js
// ComposedChart component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("figure.composed-chart");


describe("ComposedChart", () => {
  it("renders the element with its base class", async () => {
    await mount("composed-chart");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("composed-chart")).toBe(true);
  });

  it("uses the figure element", async () => {
    await mount("composed-chart");
    expect(el().tagName.toLowerCase()).toBe("figure");
  });
});
