// footnote.test.js
// Footnote component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("aside.footnote");


describe("Footnote", () => {
  it("renders the element with its base class", async () => {
    await mount("footnote");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("footnote")).toBe(true);
  });

  it("uses the aside element", async () => {
    await mount("footnote");
    expect(el().tagName.toLowerCase()).toBe("aside");
  });
});
