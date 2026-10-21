// icon-list.test.js
// IconList component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("ul.icon-list");


describe("IconList", () => {
  it("renders the element with its base class", async () => {
    await mount("icon-list");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("icon-list")).toBe(true);
  });

  it("uses the ul element", async () => {
    await mount("icon-list");
    expect(el().tagName.toLowerCase()).toBe("ul");
  });
});
