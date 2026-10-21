// time-input.test.js
// TimeInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.time-input");


describe("TimeInput", () => {
  it("renders the element with its base class", async () => {
    await mount("time-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("time-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("time-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
