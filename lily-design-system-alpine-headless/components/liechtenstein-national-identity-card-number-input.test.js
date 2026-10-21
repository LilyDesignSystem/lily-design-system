// liechtenstein-national-identity-card-number-input.test.js
// LiechtensteinNationalIdentityCardNumberInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.liechtenstein-national-identity-card-number-input");


describe("LiechtensteinNationalIdentityCardNumberInput", () => {
  it("renders the element with its base class", async () => {
    await mount("liechtenstein-national-identity-card-number-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("liechtenstein-national-identity-card-number-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("liechtenstein-national-identity-card-number-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
