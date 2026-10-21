// south-africa-identity-number-view.test.js
// SouthAfricaIdentityNumberView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.south-africa-identity-number-view");


describe("SouthAfricaIdentityNumberView", () => {
  it("renders the element with its base class", async () => {
    await mount("south-africa-identity-number-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("south-africa-identity-number-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("south-africa-identity-number-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
