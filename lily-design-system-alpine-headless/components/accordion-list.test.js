// accordion-list.test.js
// AccordionList component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.accordion-list");


describe("AccordionList", () => {
  it("renders the element with its base class", async () => {
    await mount("accordion-list");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("accordion-list")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("accordion-list");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
