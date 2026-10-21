// liechtenstein-passport-number-view.test.js
// LiechtensteinPassportNumberView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.liechtenstein-passport-number-view");


describe("LiechtensteinPassportNumberView", () => {
  it("renders the element with its base class", async () => {
    await mount("liechtenstein-passport-number-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("liechtenstein-passport-number-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("liechtenstein-passport-number-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
