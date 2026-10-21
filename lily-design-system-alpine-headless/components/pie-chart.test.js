// pie-chart.test.js
// PieChart component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("figure.pie-chart");


describe("PieChart", () => {
  it("renders the element with its base class", async () => {
    await mount("pie-chart");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("pie-chart")).toBe(true);
  });

  it("uses the figure element", async () => {
    await mount("pie-chart");
    expect(el().tagName.toLowerCase()).toBe("figure");
  });
});
