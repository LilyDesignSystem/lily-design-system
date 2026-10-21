// context-menu-item.test.js
// ContextMenuItem component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.context-menu-item");


describe("ContextMenuItem", () => {
  it("renders the element with its base class", async () => {
    await mount("context-menu-item");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("context-menu-item")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("context-menu-item");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
