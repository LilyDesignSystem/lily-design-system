// menu-item.test.js
// MenuItem component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.menu-item");


describe("MenuItem", () => {
  it("renders the element with its base class", async () => {
    await mount("menu-item");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("menu-item")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("menu-item");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
