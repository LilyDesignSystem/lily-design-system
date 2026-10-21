// pilipinas-philhealth-identification-number-view.test.js
// PilipinasPhilhealthIdentificationNumberView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.pilipinas-philhealth-identification-number-view");


describe("PilipinasPhilhealthIdentificationNumberView", () => {
  it("renders the element with its base class", async () => {
    await mount("pilipinas-philhealth-identification-number-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("pilipinas-philhealth-identification-number-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("pilipinas-philhealth-identification-number-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
