// section-link.test.js
// SectionLink component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("a.section-link");


describe("SectionLink", () => {
  it("renders the element with its base class", async () => {
    await mount("section-link");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("section-link")).toBe(true);
  });

  it("uses the a element", async () => {
    await mount("section-link");
    expect(el().tagName.toLowerCase()).toBe("a");
  });
});
