// action-bar.test.js
// ActionBar component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.action-bar");


describe("ActionBar", () => {
  it("renders the element with its base class", async () => {
    await mount("action-bar");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("action-bar")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("action-bar");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
