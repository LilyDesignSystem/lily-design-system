// headline.test.js
// Headline component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.headline");


describe("Headline", () => {
  it("renders the element with its base class", async () => {
    await mount("headline");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("headline")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("headline");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
