// radar-chart.test.js
// RadarChart component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("figure.radar-chart");


describe("RadarChart", () => {
  it("renders the element with its base class", async () => {
    await mount("radar-chart");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("radar-chart")).toBe(true);
  });

  it("uses the figure element", async () => {
    await mount("radar-chart");
    expect(el().tagName.toLowerCase()).toBe("figure");
  });
});
