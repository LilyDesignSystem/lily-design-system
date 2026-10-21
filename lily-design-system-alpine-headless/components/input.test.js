// input.test.js
// Input component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.input");


describe("Input", () => {
  it("renders the element with its base class", async () => {
    await mount("input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
