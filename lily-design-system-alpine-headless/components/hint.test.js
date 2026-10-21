// hint.test.js
// Hint component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.hint");


describe("Hint", () => {
  it("renders the element with its base class", async () => {
    await mount("hint");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("hint")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("hint");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
