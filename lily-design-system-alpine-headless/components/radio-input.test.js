// radio-input.test.js
// RadioInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.radio-input");


describe("RadioInput", () => {
  it("renders the element with its base class", async () => {
    await mount("radio-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("radio-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("radio-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
