// liechtenstein-national-identity-card-number-view.test.js
// LiechtensteinNationalIdentityCardNumberView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.liechtenstein-national-identity-card-number-view");


describe("LiechtensteinNationalIdentityCardNumberView", () => {
  it("renders the element with its base class", async () => {
    await mount("liechtenstein-national-identity-card-number-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("liechtenstein-national-identity-card-number-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("liechtenstein-national-identity-card-number-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
