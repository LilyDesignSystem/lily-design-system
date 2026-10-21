// romania-cod-numeric-personal-view.test.js
// RomaniaCodNumericPersonalView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.romania-cod-numeric-personal-view");


describe("RomaniaCodNumericPersonalView", () => {
  it("renders the element with its base class", async () => {
    await mount("romania-cod-numeric-personal-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("romania-cod-numeric-personal-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("romania-cod-numeric-personal-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
