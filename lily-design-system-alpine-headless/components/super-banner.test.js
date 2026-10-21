// super-banner.test.js
// SuperBanner component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.super-banner");


describe("SuperBanner", () => {
  it("renders the element with its base class", async () => {
    await mount("super-banner");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("super-banner")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("super-banner");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
