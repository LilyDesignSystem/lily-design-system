// contents-link.test.js
// ContentsLink component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("a.contents-link");


describe("ContentsLink", () => {
  it("renders the element with its base class", async () => {
    await mount("contents-link");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("contents-link")).toBe(true);
  });

  it("uses the a element", async () => {
    await mount("contents-link");
    expect(el().tagName.toLowerCase()).toBe("a");
  });
});
