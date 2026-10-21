// scroller-base.test.js
// ScrollerBase component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.scroller-base");


describe("ScrollerBase", () => {
  it("renders the element with its base class", async () => {
    await mount("scroller-base");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("scroller-base")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("scroller-base");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
