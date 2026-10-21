// hrvatska-osobni-identifikacijski-broj-input.test.js
// HrvatskaOsobniIdentifikacijskiBrojInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.hrvatska-osobni-identifikacijski-broj-input");


describe("HrvatskaOsobniIdentifikacijskiBrojInput", () => {
  it("renders the element with its base class", async () => {
    await mount("hrvatska-osobni-identifikacijski-broj-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("hrvatska-osobni-identifikacijski-broj-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("hrvatska-osobni-identifikacijski-broj-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
