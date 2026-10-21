// icon-button.test.js
// IconButton component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("button.icon-button");


describe("IconButton", () => {
  it("renders the element with its base class", async () => {
    await mount("icon-button");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("icon-button")).toBe(true);
  });

  it("uses the button element", async () => {
    await mount("icon-button");
    expect(el().tagName.toLowerCase()).toBe("button");
  });
});
