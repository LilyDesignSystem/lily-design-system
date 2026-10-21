// split-view.test.js
// SplitView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.split-view");


describe("SplitView", () => {
  it("renders the element with its base class", async () => {
    await mount("split-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("split-view")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("split-view");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
