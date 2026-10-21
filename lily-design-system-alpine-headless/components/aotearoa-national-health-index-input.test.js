// aotearoa-national-health-index-input.test.js
// AotearoaNationalHealthIndexInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.aotearoa-national-health-index-input");


describe("AotearoaNationalHealthIndexInput", () => {
  it("renders the element with its base class", async () => {
    await mount("aotearoa-national-health-index-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("aotearoa-national-health-index-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("aotearoa-national-health-index-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
