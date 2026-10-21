// grid.test.js
// Grid component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.grid");


describe("Grid", () => {
  it("renders the element with its base class", async () => {
    await mount("grid");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("grid")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("grid");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
