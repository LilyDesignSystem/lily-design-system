// candlestick-chart.test.js
// CandlestickChart component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("figure.candlestick-chart");


describe("CandlestickChart", () => {
  it("renders the element with its base class", async () => {
    await mount("candlestick-chart");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("candlestick-chart")).toBe(true);
  });

  it("uses the figure element", async () => {
    await mount("candlestick-chart");
    expect(el().tagName.toLowerCase()).toBe("figure");
  });
});
