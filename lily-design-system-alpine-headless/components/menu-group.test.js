// menu-group.test.js
// MenuGroup component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.menu-group");


describe("MenuGroup", () => {
  it("renders the element with its base class", async () => {
    await mount("menu-group");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("menu-group")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("menu-group");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
