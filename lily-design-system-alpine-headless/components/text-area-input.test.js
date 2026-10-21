// text-area-input.test.js
// TextAreaInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("textarea.text-area-input");


describe("TextAreaInput", () => {
  it("renders the element with its base class", async () => {
    await mount("text-area-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("text-area-input")).toBe(true);
  });

  it("uses the textarea element", async () => {
    await mount("text-area-input");
    expect(el().tagName.toLowerCase()).toBe("textarea");
  });
});
