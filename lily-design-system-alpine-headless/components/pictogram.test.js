// pictogram.test.js
// Pictogram component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("figure.pictogram");


describe("Pictogram", () => {
  it("renders the element with its base class", async () => {
    await mount("pictogram");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("pictogram")).toBe(true);
  });

  it("uses the figure element", async () => {
    await mount("pictogram");
    expect(el().tagName.toLowerCase()).toBe("figure");
  });
});
