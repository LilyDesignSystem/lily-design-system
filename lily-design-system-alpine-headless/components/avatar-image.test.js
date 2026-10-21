// avatar-image.test.js
// AvatarImage component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.avatar-image");


describe("AvatarImage", () => {
  it("renders the element with its base class", async () => {
    await mount("avatar-image");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("avatar-image")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("avatar-image");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
