// scroll-bar.test.js
// ScrollBar component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.scroll-bar");


describe("ScrollBar", () => {
  it("renders the element with its base class", async () => {
    await mount("scroll-bar");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("scroll-bar")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("scroll-bar");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
