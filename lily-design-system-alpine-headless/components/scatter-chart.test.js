// scatter-chart.test.js
// ScatterChart component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("figure.scatter-chart");


describe("ScatterChart", () => {
  it("renders the element with its base class", async () => {
    await mount("scatter-chart");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("scatter-chart")).toBe(true);
  });

  it("uses the figure element", async () => {
    await mount("scatter-chart");
    expect(el().tagName.toLowerCase()).toBe("figure");
  });
});
