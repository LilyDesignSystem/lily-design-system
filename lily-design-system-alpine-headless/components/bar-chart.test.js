// bar-chart.test.js
// BarChart component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("figure.bar-chart");


describe("BarChart", () => {
  it("renders the element with its base class", async () => {
    await mount("bar-chart");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("bar-chart")).toBe(true);
  });

  it("uses the figure element", async () => {
    await mount("bar-chart");
    expect(el().tagName.toLowerCase()).toBe("figure");
  });
});
