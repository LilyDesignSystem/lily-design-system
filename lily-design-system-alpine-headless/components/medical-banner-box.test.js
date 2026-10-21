// medical-banner-box.test.js
// MedicalBannerBox component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.medical-banner-box");


describe("MedicalBannerBox", () => {
  it("renders the element with its base class", async () => {
    await mount("medical-banner-box");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("medical-banner-box")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("medical-banner-box");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
