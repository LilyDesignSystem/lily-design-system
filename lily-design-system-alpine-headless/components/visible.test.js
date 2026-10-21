// visible.test.js
// Visible component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.visible");


describe("Visible", () => {
  it("renders the element with its base class", async () => {
    await mount("visible");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("visible")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("visible");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
