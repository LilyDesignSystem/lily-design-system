// avatar-group.test.js
// AvatarGroup component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.avatar-group");


describe("AvatarGroup", () => {
  it("renders the element with its base class", async () => {
    await mount("avatar-group");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("avatar-group")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("avatar-group");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
