// sparkline.test.js
// Sparkline component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.sparkline");


describe("Sparkline", () => {
  it("renders the element with its base class", async () => {
    await mount("sparkline");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("sparkline")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("sparkline");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
