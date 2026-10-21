// clamp-text.test.js
// ClampText component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.clamp-text");


describe("ClampText", () => {
  it("renders the element with its base class", async () => {
    await mount("clamp-text");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("clamp-text")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("clamp-text");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
