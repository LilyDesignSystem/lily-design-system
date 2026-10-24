// convert-from-unit-div.test.js
// ConvertFromUnitDiv component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.convert-from-unit-div");


describe("ConvertFromUnitDiv", () => {
  it("renders the element with its base class", async () => {
    await mount("convert-from-unit-div");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("convert-from-unit-div")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("convert-from-unit-div");
    expect(el().tagName.toLowerCase()).toBe("div");
  });

  it("has no role and no aria-label", async () => {
    await mount("convert-from-unit-div");
    expect(el().getAttribute("role")).toBeNull();
    expect(el().getAttribute("aria-label")).toBeNull();
  });
});
