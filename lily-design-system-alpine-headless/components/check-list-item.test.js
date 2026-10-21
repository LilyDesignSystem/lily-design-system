// check-list-item.test.js
// CheckListItem component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("li.check-list-item");


describe("CheckListItem", () => {
  it("renders the element with its base class", async () => {
    await mount("check-list-item");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("check-list-item")).toBe(true);
  });

  it("uses the li element", async () => {
    await mount("check-list-item");
    expect(el().tagName.toLowerCase()).toBe("li");
  });
});
