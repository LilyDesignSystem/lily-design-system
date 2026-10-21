// sverige-personnummer-input.test.js
// SverigePersonnummerInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.sverige-personnummer-input");


describe("SverigePersonnummerInput", () => {
  it("renders the element with its base class", async () => {
    await mount("sverige-personnummer-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("sverige-personnummer-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("sverige-personnummer-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
