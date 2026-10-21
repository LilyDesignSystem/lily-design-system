// kbd-shortcut.test.js
// KbdShortcut component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("kbd.kbd-shortcut");


describe("KbdShortcut", () => {
  it("renders the element with its base class", async () => {
    await mount("kbd-shortcut");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("kbd-shortcut")).toBe(true);
  });

  it("uses the kbd element", async () => {
    await mount("kbd-shortcut");
    expect(el().tagName.toLowerCase()).toBe("kbd");
  });
});
