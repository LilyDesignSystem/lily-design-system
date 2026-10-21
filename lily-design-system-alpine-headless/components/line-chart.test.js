// line-chart.test.js
// LineChart component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("figure.line-chart");


describe("LineChart", () => {
  it("renders the element with its base class", async () => {
    await mount("line-chart");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("line-chart")).toBe(true);
  });

  it("uses the figure element", async () => {
    await mount("line-chart");
    expect(el().tagName.toLowerCase()).toBe("figure");
  });
});
