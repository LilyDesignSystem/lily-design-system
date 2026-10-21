// medical-banner-box-for-advice.test.js
// MedicalBannerBoxForAdvice component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.medical-banner-box-for-advice");


describe("MedicalBannerBoxForAdvice", () => {
  it("renders the element with its base class", async () => {
    await mount("medical-banner-box-for-advice");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("medical-banner-box-for-advice")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("medical-banner-box-for-advice");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
