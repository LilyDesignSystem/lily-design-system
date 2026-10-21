// heatmap-chart.test.js
// HeatmapChart component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("figure.heatmap-chart");


describe("HeatmapChart", () => {
  it("renders the element with its base class", async () => {
    await mount("heatmap-chart");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("heatmap-chart")).toBe(true);
  });

  it("uses the figure element", async () => {
    await mount("heatmap-chart");
    expect(el().tagName.toLowerCase()).toBe("figure");
  });
});
