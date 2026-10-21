// blockquote.test.js
// Blockquote component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("blockquote.blockquote");


describe("Blockquote", () => {
  it("renders the element with its base class", async () => {
    await mount("blockquote");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("blockquote")).toBe(true);
  });

  it("uses the blockquote element", async () => {
    await mount("blockquote");
    expect(el().tagName.toLowerCase()).toBe("blockquote");
  });
});
