// kbd.test.js
// Kbd component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("kbd.kbd");


describe("Kbd", () => {
  it("renders the element with its base class", async () => {
    await mount("kbd");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("kbd")).toBe(true);
  });

  it("uses the kbd element", async () => {
    await mount("kbd");
    expect(el().tagName.toLowerCase()).toBe("kbd");
  });
});
