// date-input.test.js
// DateInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.date-input");


describe("DateInput", () => {
  it("renders the element with its base class", async () => {
    await mount("date-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("date-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("date-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
