// misr-al-raqm-al-qawmi-input.test.js
// MisrAlRaqmAlQawmiInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.misr-al-raqm-al-qawmi-input");


describe("MisrAlRaqmAlQawmiInput", () => {
  it("renders the element with its base class", async () => {
    await mount("misr-al-raqm-al-qawmi-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("misr-al-raqm-al-qawmi-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("misr-al-raqm-al-qawmi-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
