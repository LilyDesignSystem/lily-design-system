// time-picker-input.test.js
// TimePickerInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.time-picker-input");


describe("TimePickerInput", () => {
  it("renders the element with its base class", async () => {
    await mount("time-picker-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("time-picker-input")).toBe(true);
  });

  it("is a native time input", async () => {
    await mount("time-picker-input");
    expect(el().type).toBe("time");
    expect(el().hasAttribute("role")).toBe(false);
  });
  it("two-way binds its value into data-value", async () => {
    await mount("time-picker-input");
    el().value = "09:30";
    el().dispatchEvent(new Event("input", { bubbles: true })); await tick();
    expect(el().getAttribute("data-value")).toBe("09:30");
  });
});
