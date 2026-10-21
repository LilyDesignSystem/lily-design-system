// banner.test.js
// Banner component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.banner");


describe("Banner", () => {
  it("renders the element with its base class", async () => {
    await mount("banner");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("banner")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("banner");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
