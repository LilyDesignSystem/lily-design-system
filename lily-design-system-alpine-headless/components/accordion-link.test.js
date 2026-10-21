// accordion-link.test.js
// AccordionLink component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("a.accordion-link");


describe("AccordionLink", () => {
  it("renders the element with its base class", async () => {
    await mount("accordion-link");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("accordion-link")).toBe(true);
  });

  it("uses the a element", async () => {
    await mount("accordion-link");
    expect(el().tagName.toLowerCase()).toBe("a");
  });
});
