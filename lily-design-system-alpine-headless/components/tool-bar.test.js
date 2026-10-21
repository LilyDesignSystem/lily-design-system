// tool-bar.test.js
// ToolBar component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.tool-bar");


describe("ToolBar", () => {
  it("renders the element with its base class", async () => {
    await mount("tool-bar");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("tool-bar")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("tool-bar");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
