// number-input.test.js
// NumberInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.number-input");


describe("NumberInput", () => {
  it("renders the element with its base class", async () => {
    await mount("number-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("number-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("number-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
