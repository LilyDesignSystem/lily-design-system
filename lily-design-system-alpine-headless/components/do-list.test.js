// do-list.test.js
// DoList component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("ul.do-list");


describe("DoList", () => {
  it("renders the element with its base class", async () => {
    await mount("do-list");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("do-list")).toBe(true);
  });

  it("uses the ul element", async () => {
    await mount("do-list");
    expect(el().tagName.toLowerCase()).toBe("ul");
  });
});
