// hrvatska-osobni-identifikacijski-broj-view.test.js
// HrvatskaOsobniIdentifikacijskiBrojView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.hrvatska-osobni-identifikacijski-broj-view");


describe("HrvatskaOsobniIdentifikacijskiBrojView", () => {
  it("renders the element with its base class", async () => {
    await mount("hrvatska-osobni-identifikacijski-broj-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("hrvatska-osobni-identifikacijski-broj-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("hrvatska-osobni-identifikacijski-broj-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
