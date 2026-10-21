// sunburst-chart.test.js
// SunburstChart component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("figure.sunburst-chart");


describe("SunburstChart", () => {
  it("renders the element with its base class", async () => {
    await mount("sunburst-chart");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("sunburst-chart")).toBe(true);
  });

  it("uses the figure element", async () => {
    await mount("sunburst-chart");
    expect(el().tagName.toLowerCase()).toBe("figure");
  });
});
