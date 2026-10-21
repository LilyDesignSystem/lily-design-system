// menu-bar-button.test.js
// MenuBarButton component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("button.menu-bar-button");


describe("MenuBarButton", () => {
  it("renders the element with its base class", async () => {
    await mount("menu-bar-button");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("menu-bar-button")).toBe(true);
  });

  it("uses the button element", async () => {
    await mount("menu-bar-button");
    expect(el().tagName.toLowerCase()).toBe("button");
  });
});
