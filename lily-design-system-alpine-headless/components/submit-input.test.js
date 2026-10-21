// submit-input.test.js
// SubmitInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.submit-input");


describe("SubmitInput", () => {
  it("renders the element with its base class", async () => {
    await mount("submit-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("submit-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("submit-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
