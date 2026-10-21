// place.test.js
// Place component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("article.place");


describe("Place", () => {
  it("renders the element with its base class", async () => {
    await mount("place");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("place")).toBe(true);
  });

  it("uses the article element", async () => {
    await mount("place");
    expect(el().tagName.toLowerCase()).toBe("article");
  });
});
