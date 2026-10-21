// diff.test.js
// Diff component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.diff");


describe("Diff", () => {
  it("renders the element with its base class", async () => {
    await mount("diff");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("diff")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("diff");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
