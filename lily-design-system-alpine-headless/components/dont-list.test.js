// dont-list.test.js
// DontList component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("ul.dont-list");


describe("DontList", () => {
  it("renders the element with its base class", async () => {
    await mount("dont-list");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("dont-list")).toBe(true);
  });

  it("uses the ul element", async () => {
    await mount("dont-list");
    expect(el().tagName.toLowerCase()).toBe("ul");
  });
});
