// postal-code-input.test.js
// PostalCodeInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.postal-code-input");


describe("PostalCodeInput", () => {
  it("renders the element with its base class", async () => {
    await mount("postal-code-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("postal-code-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("postal-code-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
