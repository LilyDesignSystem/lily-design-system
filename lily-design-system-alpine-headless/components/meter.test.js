// meter.test.js
// Meter component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("meter.meter");


describe("Meter", () => {
  it("renders the element with its base class", async () => {
    await mount("meter");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("meter")).toBe(true);
  });

  it("uses the meter element", async () => {
    await mount("meter");
    expect(el().tagName.toLowerCase()).toBe("meter");
  });
});
