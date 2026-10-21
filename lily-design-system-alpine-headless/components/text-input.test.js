// text-input.test.js
// TextInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.text-input");


describe("TextInput", () => {
  it("renders the element with its base class", async () => {
    await mount("text-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("text-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("text-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
