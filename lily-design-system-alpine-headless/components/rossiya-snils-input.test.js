// rossiya-snils-input.test.js
// RossiyaSnilsInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.rossiya-snils-input");


describe("RossiyaSnilsInput", () => {
  it("renders the element with its base class", async () => {
    await mount("rossiya-snils-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("rossiya-snils-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("rossiya-snils-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
