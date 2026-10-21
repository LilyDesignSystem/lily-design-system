// section-list-item.test.js
// SectionListItem component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("li.section-list-item");


describe("SectionListItem", () => {
  it("renders the element with its base class", async () => {
    await mount("section-list-item");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("section-list-item")).toBe(true);
  });

  it("uses the li element", async () => {
    await mount("section-list-item");
    expect(el().tagName.toLowerCase()).toBe("li");
  });
});
