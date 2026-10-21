// norge-fodselsnummer-input.test.js
// NorgeFodselsnummerInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.norge-fodselsnummer-input");


describe("NorgeFodselsnummerInput", () => {
  it("renders the element with its base class", async () => {
    await mount("norge-fodselsnummer-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("norge-fodselsnummer-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("norge-fodselsnummer-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
