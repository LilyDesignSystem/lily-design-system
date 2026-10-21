// contents-nav.test.js
// ContentsNav component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("nav.contents-nav");


describe("ContentsNav", () => {
  it("renders the element with its base class", async () => {
    await mount("contents-nav");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("contents-nav")).toBe(true);
  });

  it("uses the nav element", async () => {
    await mount("contents-nav");
    expect(el().tagName.toLowerCase()).toBe("nav");
  });
});
