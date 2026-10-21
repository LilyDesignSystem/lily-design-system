// button.test.js
// Button component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("button.button");


describe("Button", () => {
  it("renders the element with its base class", async () => {
    await mount("button");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("button")).toBe(true);
  });

  it("uses the button element", async () => {
    await mount("button");
    expect(el().tagName.toLowerCase()).toBe("button");
  });
});
