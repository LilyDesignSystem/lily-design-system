// masonry.test.js
// Masonry component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.masonry");


describe("Masonry", () => {
  it("renders the element with its base class", async () => {
    await mount("masonry");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("masonry")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("masonry");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
