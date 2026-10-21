// padding-reset.test.js
// PaddingReset component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.padding-reset");


describe("PaddingReset", () => {
  it("renders the element with its base class", async () => {
    await mount("padding-reset");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("padding-reset")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("padding-reset");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
