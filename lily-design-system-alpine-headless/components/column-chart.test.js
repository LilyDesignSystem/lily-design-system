// column-chart.test.js
// ColumnChart component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("figure.column-chart");


describe("ColumnChart", () => {
  it("renders the element with its base class", async () => {
    await mount("column-chart");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("column-chart")).toBe(true);
  });

  it("uses the figure element", async () => {
    await mount("column-chart");
    expect(el().tagName.toLowerCase()).toBe("figure");
  });
});
