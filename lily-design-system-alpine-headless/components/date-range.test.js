// date-range.test.js
// DateRange component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("fieldset.date-range");


describe("DateRange", () => {
  it("renders the element with its base class", async () => {
    await mount("date-range");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("date-range")).toBe(true);
  });

  it("uses the fieldset element", async () => {
    await mount("date-range");
    expect(el().tagName.toLowerCase()).toBe("fieldset");
  });
});
