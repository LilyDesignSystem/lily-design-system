// range-input.test.js
// RangeInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.range-input");


describe("RangeInput", () => {
  it("renders the element with its base class", async () => {
    await mount("range-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("range-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("range-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
