// tile-map.test.js
// TileMap component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.tile-map");


describe("TileMap", () => {
  it("renders the element with its base class", async () => {
    await mount("tile-map");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("tile-map")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("tile-map");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
