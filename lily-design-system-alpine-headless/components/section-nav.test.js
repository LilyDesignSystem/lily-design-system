// section-nav.test.js
// SectionNav component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("nav.section-nav");


describe("SectionNav", () => {
  it("renders the element with its base class", async () => {
    await mount("section-nav");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("section-nav")).toBe(true);
  });

  it("uses the nav element", async () => {
    await mount("section-nav");
    expect(el().tagName.toLowerCase()).toBe("nav");
  });
});
