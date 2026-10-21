// avatar.test.js
// Avatar component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.avatar");


describe("Avatar", () => {
  it("renders the element with its base class", async () => {
    await mount("avatar");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("avatar")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("avatar");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
