// united-states-social-security-number-input.test.js
// UnitedStatesSocialSecurityNumberInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.united-states-social-security-number-input");


describe("UnitedStatesSocialSecurityNumberInput", () => {
  it("renders the element with its base class", async () => {
    await mount("united-states-social-security-number-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("united-states-social-security-number-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("united-states-social-security-number-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
