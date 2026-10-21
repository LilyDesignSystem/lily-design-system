// button-input.test.js
// ButtonInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.button-input");


describe("ButtonInput", () => {
  it("renders the element with its base class", async () => {
    await mount("button-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("button-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("button-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
