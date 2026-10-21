// hero.test.js
// Hero component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("section.hero");


describe("Hero", () => {
  it("renders the element with its base class", async () => {
    await mount("hero");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("hero")).toBe(true);
  });

  it("uses the section element", async () => {
    await mount("hero");
    expect(el().tagName.toLowerCase()).toBe("section");
  });
});
