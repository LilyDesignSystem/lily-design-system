// collection-list.test.js
// CollectionList component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("ul.collection-list");


describe("CollectionList", () => {
  it("renders the element with its base class", async () => {
    await mount("collection-list");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("collection-list")).toBe(true);
  });

  it("uses the ul element", async () => {
    await mount("collection-list");
    expect(el().tagName.toLowerCase()).toBe("ul");
  });
});
