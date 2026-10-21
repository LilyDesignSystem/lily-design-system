// romania-cod-numeric-personal-input.test.js
// RomaniaCodNumericPersonalInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.romania-cod-numeric-personal-input");


describe("RomaniaCodNumericPersonalInput", () => {
  it("renders the element with its base class", async () => {
    await mount("romania-cod-numeric-personal-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("romania-cod-numeric-personal-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("romania-cod-numeric-personal-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
