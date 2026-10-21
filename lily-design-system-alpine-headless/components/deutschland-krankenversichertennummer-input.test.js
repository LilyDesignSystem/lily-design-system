// deutschland-krankenversichertennummer-input.test.js
// DeutschlandKrankenversichertennummerInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.deutschland-krankenversichertennummer-input");


describe("DeutschlandKrankenversichertennummerInput", () => {
  it("renders the element with its base class", async () => {
    await mount("deutschland-krankenversichertennummer-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("deutschland-krankenversichertennummer-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("deutschland-krankenversichertennummer-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
