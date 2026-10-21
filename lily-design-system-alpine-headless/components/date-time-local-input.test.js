// date-time-local-input.test.js
// DateTimeLocalInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.date-time-local-input");


describe("DateTimeLocalInput", () => {
  it("renders the element with its base class", async () => {
    await mount("date-time-local-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("date-time-local-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("date-time-local-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
