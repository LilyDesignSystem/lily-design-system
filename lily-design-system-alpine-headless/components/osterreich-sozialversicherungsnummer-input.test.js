// osterreich-sozialversicherungsnummer-input.test.js
// OsterreichSozialversicherungsnummerInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.osterreich-sozialversicherungsnummer-input");


describe("OsterreichSozialversicherungsnummerInput", () => {
  it("renders the element with its base class", async () => {
    await mount("osterreich-sozialversicherungsnummer-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("osterreich-sozialversicherungsnummer-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("osterreich-sozialversicherungsnummer-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
