// contents-list-item.test.js
// ContentsListItem component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("li.contents-list-item");


describe("ContentsListItem", () => {
  it("renders the element with its base class", async () => {
    await mount("contents-list-item");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("contents-list-item")).toBe(true);
  });

  it("uses the li element", async () => {
    await mount("contents-list-item");
    expect(el().tagName.toLowerCase()).toBe("li");
  });
});
