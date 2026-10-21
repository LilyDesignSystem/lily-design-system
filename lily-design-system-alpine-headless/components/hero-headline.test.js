// hero-headline.test.js
// HeroHeadline component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.hero-headline");


describe("HeroHeadline", () => {
  it("renders the element with its base class", async () => {
    await mount("hero-headline");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("hero-headline")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("hero-headline");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
