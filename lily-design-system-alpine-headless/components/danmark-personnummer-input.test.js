// danmark-personnummer-input.test.js
// DanmarkPersonnummerInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.danmark-personnummer-input");


describe("DanmarkPersonnummerInput", () => {
  it("renders the element with its base class", async () => {
    await mount("danmark-personnummer-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("danmark-personnummer-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("danmark-personnummer-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
