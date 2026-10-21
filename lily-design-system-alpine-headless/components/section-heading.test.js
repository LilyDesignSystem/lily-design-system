// section-heading.test.js
// SectionHeading component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("header.section-heading");


describe("SectionHeading", () => {
  it("renders the element with its base class", async () => {
    await mount("section-heading");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("section-heading")).toBe(true);
  });

  it("uses the header element", async () => {
    await mount("section-heading");
    expect(el().tagName.toLowerCase()).toBe("header");
  });
});
