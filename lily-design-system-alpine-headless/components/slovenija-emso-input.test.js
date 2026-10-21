// slovenija-emso-input.test.js
// SlovenijaEmsoInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.slovenija-emso-input");


describe("SlovenijaEmsoInput", () => {
  it("renders the element with its base class", async () => {
    await mount("slovenija-emso-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("slovenija-emso-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("slovenija-emso-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
