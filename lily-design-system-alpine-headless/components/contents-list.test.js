// contents-list.test.js
// ContentsList component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("ol.contents-list");


describe("ContentsList", () => {
  it("renders the element with its base class", async () => {
    await mount("contents-list");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("contents-list")).toBe(true);
  });

  it("uses the ol element", async () => {
    await mount("contents-list");
    expect(el().tagName.toLowerCase()).toBe("ol");
  });
});
