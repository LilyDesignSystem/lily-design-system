// south-africa-identity-number-input.test.js
// SouthAfricaIdentityNumberInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.south-africa-identity-number-input");


describe("SouthAfricaIdentityNumberInput", () => {
  it("renders the element with its base class", async () => {
    await mount("south-africa-identity-number-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("south-africa-identity-number-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("south-africa-identity-number-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
