// funnel-chart.test.js
// FunnelChart component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("figure.funnel-chart");


describe("FunnelChart", () => {
  it("renders the element with its base class", async () => {
    await mount("funnel-chart");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("funnel-chart")).toBe(true);
  });

  it("uses the figure element", async () => {
    await mount("funnel-chart");
    expect(el().tagName.toLowerCase()).toBe("figure");
  });
});
