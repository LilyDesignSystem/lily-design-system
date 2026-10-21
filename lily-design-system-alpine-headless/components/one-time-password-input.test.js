// one-time-password-input.test.js
// OneTimePasswordInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.one-time-password-input");


describe("OneTimePasswordInput", () => {
  it("renders the element with its base class", async () => {
    await mount("one-time-password-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("one-time-password-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("one-time-password-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
