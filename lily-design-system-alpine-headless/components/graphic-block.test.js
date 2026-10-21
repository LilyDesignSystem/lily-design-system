// graphic-block.test.js
// GraphicBlock component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("figure.graphic-block");


describe("GraphicBlock", () => {
  it("renders the element with its base class", async () => {
    await mount("graphic-block");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("graphic-block")).toBe(true);
  });

  it("uses the figure element", async () => {
    await mount("graphic-block");
    expect(el().tagName.toLowerCase()).toBe("figure");
  });
});
