// mockup-watch.test.js
// MockupWatch component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.mockup-watch");


describe("MockupWatch", () => {
  it("renders the element with its base class", async () => {
    await mount("mockup-watch");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("mockup-watch")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("mockup-watch");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
