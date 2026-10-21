// kypros-national-passport-number-view.test.js
// KyprosNationalPassportNumberView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.kypros-national-passport-number-view");


describe("KyprosNationalPassportNumberView", () => {
  it("renders the element with its base class", async () => {
    await mount("kypros-national-passport-number-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("kypros-national-passport-number-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("kypros-national-passport-number-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
