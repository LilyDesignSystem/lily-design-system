// emoji.test.js
// Emoji component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.emoji");


describe("Emoji", () => {
  it("renders the element with its base class", async () => {
    await mount("emoji");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("emoji")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("emoji");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
