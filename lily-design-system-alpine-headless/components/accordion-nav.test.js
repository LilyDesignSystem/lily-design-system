// accordion-nav.test.js
// AccordionNav component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("nav.accordion-nav");


describe("AccordionNav", () => {
  it("renders the element with its base class", async () => {
    await mount("accordion-nav");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("accordion-nav")).toBe(true);
  });

  const triggers = () => [...document.querySelectorAll(".accordion-trigger")];
  const panels = () => [...document.querySelectorAll(".accordion-panel")];
  it("starts with every panel collapsed, linked both ways", async () => {
    await mount("accordion-nav");
    expect(panels().map((p) => p.hidden)).toEqual([true, true]);
    expect(triggers()[0].getAttribute("aria-controls")).toBe(panels()[0].id);
    expect(panels()[0].getAttribute("aria-labelledby")).toBe(triggers()[0].id);
  });
  it("opens one panel at a time", async () => {
    await mount("accordion-nav");
    triggers()[0].click(); await tick();
    expect(panels().map((p) => p.hidden)).toEqual([false, true]);
    triggers()[1].click(); await tick();
    expect(panels().map((p) => p.hidden)).toEqual([true, false]);
    triggers()[1].click(); await tick();
    expect(panels().map((p) => p.hidden)).toEqual([true, true]);
  });
});
