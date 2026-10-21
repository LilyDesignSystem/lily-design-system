// flair.test.js
// Flair component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.flair");


describe("Flair", () => {
  it("renders the element with its base class", async () => {
    await mount("flair");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("flair")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("flair");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
