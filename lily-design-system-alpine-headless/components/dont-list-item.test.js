// dont-list-item.test.js
// DontListItem component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("li.dont-list-item");


describe("DontListItem", () => {
  it("renders the element with its base class", async () => {
    await mount("dont-list-item");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("dont-list-item")).toBe(true);
  });

  it("uses the li element", async () => {
    await mount("dont-list-item");
    expect(el().tagName.toLowerCase()).toBe("li");
  });
});
