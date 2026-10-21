// ring-chart.test.js
// RingChart component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("figure.ring-chart");


describe("RingChart", () => {
  it("renders the element with its base class", async () => {
    await mount("ring-chart");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("ring-chart")).toBe(true);
  });

  it("uses the figure element", async () => {
    await mount("ring-chart");
    expect(el().tagName.toLowerCase()).toBe("figure");
  });
});
