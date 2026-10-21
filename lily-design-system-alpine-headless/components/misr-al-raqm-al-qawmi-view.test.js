// misr-al-raqm-al-qawmi-view.test.js
// MisrAlRaqmAlQawmiView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.misr-al-raqm-al-qawmi-view");


describe("MisrAlRaqmAlQawmiView", () => {
  it("renders the element with its base class", async () => {
    await mount("misr-al-raqm-al-qawmi-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("misr-al-raqm-al-qawmi-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("misr-al-raqm-al-qawmi-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
