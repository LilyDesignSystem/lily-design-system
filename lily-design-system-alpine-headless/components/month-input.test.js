// month-input.test.js
// MonthInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.month-input");


describe("MonthInput", () => {
  it("renders the element with its base class", async () => {
    await mount("month-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("month-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("month-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
