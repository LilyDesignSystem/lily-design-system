// collection-list-item.test.js
// CollectionListItem component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("li.collection-list-item");


describe("CollectionListItem", () => {
  it("renders the element with its base class", async () => {
    await mount("collection-list-item");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("collection-list-item")).toBe(true);
  });

  it("uses the li element", async () => {
    await mount("collection-list-item");
    expect(el().tagName.toLowerCase()).toBe("li");
  });
});
