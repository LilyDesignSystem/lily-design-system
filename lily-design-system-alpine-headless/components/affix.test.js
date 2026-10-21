// affix.test.js
// Affix component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.affix");


describe("Affix", () => {
  it("renders the element with its base class", async () => {
    await mount("affix");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("affix")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("affix");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
