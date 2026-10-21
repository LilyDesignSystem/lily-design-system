// medical-banner.test.js
// MedicalBanner component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.medical-banner");


describe("MedicalBanner", () => {
  it("renders the element with its base class", async () => {
    await mount("medical-banner");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("medical-banner")).toBe(true);
  });

  it("hides itself and emits close when dismissed", async () => {
    await mount("medical-banner");
    const closed = vi.fn();
    el().addEventListener("close", closed);
    expect(el().hidden).toBe(false);
    document.querySelector("[data-dismiss]").click(); await tick();
    expect(el().hidden).toBe(true);
    expect(closed).toHaveBeenCalledTimes(1);
  });
});
