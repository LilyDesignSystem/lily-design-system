// sankey-chart.test.js
// SankeyChart component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("figure.sankey-chart");


describe("SankeyChart", () => {
  it("renders the element with its base class", async () => {
    await mount("sankey-chart");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("sankey-chart")).toBe(true);
  });

  it("uses the figure element", async () => {
    await mount("sankey-chart");
    expect(el().tagName.toLowerCase()).toBe("figure");
  });
});
