// choropleth-chart.test.js
// ChoroplethChart component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("figure.choropleth-chart");


describe("ChoroplethChart", () => {
  it("renders the element with its base class", async () => {
    await mount("choropleth-chart");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("choropleth-chart")).toBe(true);
  });

  it("uses the figure element", async () => {
    await mount("choropleth-chart");
    expect(el().tagName.toLowerCase()).toBe("figure");
  });
});
