// mockup-laptop.test.js
// MockupLaptop component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.mockup-laptop");


describe("MockupLaptop", () => {
  it("renders the element with its base class", async () => {
    await mount("mockup-laptop");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("mockup-laptop")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("mockup-laptop");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
