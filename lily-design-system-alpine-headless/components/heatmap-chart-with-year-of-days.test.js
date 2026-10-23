// heatmap-chart-with-year-of-days.test.js
// HeatmapChartWithYearOfDays component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("figure.heatmap-chart-with-year-of-days");


describe("HeatmapChartWithYearOfDays", () => {
  it("renders the element with its base class", async () => {
    await mount("heatmap-chart-with-year-of-days");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("heatmap-chart-with-year-of-days")).toBe(true);
  });

  it("uses the figure element", async () => {
    await mount("heatmap-chart-with-year-of-days");
    expect(el().tagName.toLowerCase()).toBe("figure");
  });

  it("carries data-year and data-week-start", async () => {
    await mount("heatmap-chart-with-year-of-days");
    expect(el().getAttribute("data-year")).toBe("2026");
    expect(el().getAttribute("data-week-start")).toBe("0");
  });
});
