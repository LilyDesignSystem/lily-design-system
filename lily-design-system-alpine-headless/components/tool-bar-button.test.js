// tool-bar-button.test.js
// ToolBarButton component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("button.tool-bar-button");


describe("ToolBarButton", () => {
  it("renders the element with its base class", async () => {
    await mount("tool-bar-button");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("tool-bar-button")).toBe(true);
  });

  it("uses the button element", async () => {
    await mount("tool-bar-button");
    expect(el().tagName.toLowerCase()).toBe("button");
  });
});
