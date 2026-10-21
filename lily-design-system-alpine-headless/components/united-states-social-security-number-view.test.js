// united-states-social-security-number-view.test.js
// UnitedStatesSocialSecurityNumberView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.united-states-social-security-number-view");


describe("UnitedStatesSocialSecurityNumberView", () => {
  it("renders the element with its base class", async () => {
    await mount("united-states-social-security-number-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("united-states-social-security-number-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("united-states-social-security-number-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
