// file-input.test.js
// FileInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.file-input");


describe("FileInput", () => {
  it("renders the element with its base class", async () => {
    await mount("file-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("file-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("file-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
