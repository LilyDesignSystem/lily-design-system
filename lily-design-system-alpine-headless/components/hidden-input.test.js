// hidden-input.test.js
// HiddenInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.hidden-input");


describe("HiddenInput", () => {
  it("renders the element with its base class", async () => {
    await mount("hidden-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("hidden-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("hidden-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
