// content-block.test.js
// ContentBlock component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.content-block");


describe("ContentBlock", () => {
  it("renders the element with its base class", async () => {
    await mount("content-block");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("content-block")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("content-block");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
