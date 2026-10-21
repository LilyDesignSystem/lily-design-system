// scroller.test.js
// Scroller component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.scroller");


describe("Scroller", () => {
  it("renders the element with its base class", async () => {
    await mount("scroller");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("scroller")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("scroller");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
