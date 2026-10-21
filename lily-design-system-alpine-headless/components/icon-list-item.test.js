// icon-list-item.test.js
// IconListItem component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("li.icon-list-item");


describe("IconListItem", () => {
  it("renders the element with its base class", async () => {
    await mount("icon-list-item");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("icon-list-item")).toBe(true);
  });

  it("uses the li element", async () => {
    await mount("icon-list-item");
    expect(el().tagName.toLowerCase()).toBe("li");
  });
});
