// malta-passport-number-view.test.js
// MaltaPassportNumberView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.malta-passport-number-view");


describe("MaltaPassportNumberView", () => {
  it("renders the element with its base class", async () => {
    await mount("malta-passport-number-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("malta-passport-number-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("malta-passport-number-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
