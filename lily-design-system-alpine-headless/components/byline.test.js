// byline.test.js
// Byline component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.byline");


describe("Byline", () => {
  it("renders the element with its base class", async () => {
    await mount("byline");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("byline")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("byline");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
