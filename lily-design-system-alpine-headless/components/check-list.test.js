// check-list.test.js
// CheckList component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("ol.check-list");


describe("CheckList", () => {
  it("renders the element with its base class", async () => {
    await mount("check-list");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("check-list")).toBe(true);
  });

  it("uses the ol element", async () => {
    await mount("check-list");
    expect(el().tagName.toLowerCase()).toBe("ol");
  });
});
