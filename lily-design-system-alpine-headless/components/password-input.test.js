// password-input.test.js
// PasswordInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.password-input");


describe("PasswordInput", () => {
  it("renders the element with its base class", async () => {
    await mount("password-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("password-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("password-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
