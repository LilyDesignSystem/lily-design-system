// input-with-mask.test.js
// InputWithMask component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.input-with-mask");


describe("InputWithMask", () => {
  it("renders the element with its base class", async () => {
    await mount("input-with-mask");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("input-with-mask")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("input-with-mask");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
