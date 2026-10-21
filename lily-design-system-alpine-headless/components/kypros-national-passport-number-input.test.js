// kypros-national-passport-number-input.test.js
// KyprosNationalPassportNumberInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.kypros-national-passport-number-input");


describe("KyprosNationalPassportNumberInput", () => {
  it("renders the element with its base class", async () => {
    await mount("kypros-national-passport-number-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("kypros-national-passport-number-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("kypros-national-passport-number-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
