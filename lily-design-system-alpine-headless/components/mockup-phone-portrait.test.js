// mockup-phone-portrait.test.js
// MockupPhonePortrait component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.mockup-phone-portrait");


describe("MockupPhonePortrait", () => {
  it("renders the element with its base class", async () => {
    await mount("mockup-phone-portrait");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("mockup-phone-portrait")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("mockup-phone-portrait");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
