// banner-box.test.js
// BannerBox component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.banner-box");


describe("BannerBox", () => {
  it("renders the element with its base class", async () => {
    await mount("banner-box");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("banner-box")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("banner-box");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
