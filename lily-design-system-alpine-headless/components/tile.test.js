// tile.test.js
// Tile component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.tile");


describe("Tile", () => {
  it("renders the element with its base class", async () => {
    await mount("tile");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("tile")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("tile");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
