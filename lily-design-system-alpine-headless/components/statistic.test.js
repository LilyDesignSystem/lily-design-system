// statistic.test.js
// Statistic component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.statistic");


describe("Statistic", () => {
  it("renders the element with its base class", async () => {
    await mount("statistic");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("statistic")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("statistic");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
