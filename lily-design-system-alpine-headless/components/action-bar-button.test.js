// action-bar-button.test.js
// ActionBarButton component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("button.action-bar-button");


describe("ActionBarButton", () => {
  it("renders the element with its base class", async () => {
    await mount("action-bar-button");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("action-bar-button")).toBe(true);
  });

  it("uses the button element", async () => {
    await mount("action-bar-button");
    expect(el().tagName.toLowerCase()).toBe("button");
  });
});
