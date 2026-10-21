// avatar-text.test.js
// AvatarText component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.avatar-text");


describe("AvatarText", () => {
  it("renders the element with its base class", async () => {
    await mount("avatar-text");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("avatar-text")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("avatar-text");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
