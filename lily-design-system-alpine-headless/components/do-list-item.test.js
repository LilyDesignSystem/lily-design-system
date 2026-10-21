// do-list-item.test.js
// DoListItem component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("li.do-list-item");


describe("DoListItem", () => {
  it("renders the element with its base class", async () => {
    await mount("do-list-item");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("do-list-item")).toBe(true);
  });

  it("uses the li element", async () => {
    await mount("do-list-item");
    expect(el().tagName.toLowerCase()).toBe("li");
  });
});
