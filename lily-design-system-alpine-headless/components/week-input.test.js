// week-input.test.js
// WeekInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.week-input");


describe("WeekInput", () => {
  it("renders the element with its base class", async () => {
    await mount("week-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("week-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("week-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
