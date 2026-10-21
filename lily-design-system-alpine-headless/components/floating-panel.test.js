// floating-panel.test.js
// FloatingPanel component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.floating-panel");


describe("FloatingPanel", () => {
  it("renders the element with its base class", async () => {
    await mount("floating-panel");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("floating-panel")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("floating-panel");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
