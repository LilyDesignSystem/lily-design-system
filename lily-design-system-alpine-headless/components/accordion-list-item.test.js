// accordion-list-item.test.js
// AccordionListItem component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("li.accordion-list-item");


describe("AccordionListItem", () => {
  it("renders the element with its base class", async () => {
    await mount("accordion-list-item");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("accordion-list-item")).toBe(true);
  });

  it("uses the li element", async () => {
    await mount("accordion-list-item");
    expect(el().tagName.toLowerCase()).toBe("li");
  });
});
