// gauge-chart.test.js
// GaugeChart component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("figure.gauge-chart");


describe("GaugeChart", () => {
  it("renders the element with its base class", async () => {
    await mount("gauge-chart");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("gauge-chart")).toBe(true);
  });

  it("uses the figure element", async () => {
    await mount("gauge-chart");
    expect(el().tagName.toLowerCase()).toBe("figure");
  });
});
