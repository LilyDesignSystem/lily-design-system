// section-list.test.js
// SectionList component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("ul.section-list");


describe("SectionList", () => {
  it("renders the element with its base class", async () => {
    await mount("section-list");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("section-list")).toBe(true);
  });

  it("uses the ul element", async () => {
    await mount("section-list");
    expect(el().tagName.toLowerCase()).toBe("ul");
  });
});
