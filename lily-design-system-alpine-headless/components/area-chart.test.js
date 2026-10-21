// area-chart.test.js
// AreaChart component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("figure.area-chart");


describe("AreaChart", () => {
  it("renders the element with its base class", async () => {
    await mount("area-chart");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("area-chart")).toBe(true);
  });

  it("uses the figure element", async () => {
    await mount("area-chart");
    expect(el().tagName.toLowerCase()).toBe("figure");
  });
});
