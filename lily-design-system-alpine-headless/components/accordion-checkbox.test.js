// accordion-checkbox.test.js
// AccordionCheckbox component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.accordion-checkbox");


describe("AccordionCheckbox", () => {
  it("renders the element with its base class", async () => {
    await mount("accordion-checkbox");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("accordion-checkbox")).toBe(true);
  });

  it("is a real checkbox controlling a hidden region", async () => {
    await mount("accordion-checkbox");
    const i = document.querySelector(".accordion-checkbox-input"), p = document.querySelector(".accordion-checkbox-panel");
    expect(i.type).toBe("checkbox");
    expect(i.getAttribute("aria-expanded")).toBe("false");
    expect(p.hidden).toBe(true);
    i.click(); await tick();
    expect(i.checked).toBe(true);
    expect(i.getAttribute("aria-expanded")).toBe("true");
    expect(p.hidden).toBe(false);
    i.click(); await tick();
    expect(p.hidden).toBe(true);
  });
});
