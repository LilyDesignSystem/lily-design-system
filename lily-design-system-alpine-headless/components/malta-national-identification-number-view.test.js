// malta-national-identification-number-view.test.js
// MaltaNationalIdentificationNumberView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.malta-national-identification-number-view");


describe("MaltaNationalIdentificationNumberView", () => {
  it("renders the element with its base class", async () => {
    await mount("malta-national-identification-number-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("malta-national-identification-number-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("malta-national-identification-number-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
