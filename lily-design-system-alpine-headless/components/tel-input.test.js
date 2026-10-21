// tel-input.test.js
// TelInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.tel-input");


describe("TelInput", () => {
  it("renders the element with its base class", async () => {
    await mount("tel-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("tel-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("tel-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
