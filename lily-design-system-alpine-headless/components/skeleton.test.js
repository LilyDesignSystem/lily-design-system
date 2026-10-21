// skeleton.test.js
// Skeleton component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.skeleton");


describe("Skeleton", () => {
  it("renders the element with its base class", async () => {
    await mount("skeleton");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("skeleton")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("skeleton");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
