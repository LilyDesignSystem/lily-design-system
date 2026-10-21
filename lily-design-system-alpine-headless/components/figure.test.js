// figure.test.js
// Figure component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("figure.figure");


describe("Figure", () => {
  it("renders the element with its base class", async () => {
    await mount("figure");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("figure")).toBe(true);
  });

  it("uses the figure element", async () => {
    await mount("figure");
    expect(el().tagName.toLowerCase()).toBe("figure");
  });
});
