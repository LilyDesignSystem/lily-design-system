// table-body.test.js
// TableBody component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.table-body");


describe("TableBody", () => {
  it("renders the element with its base class", async () => {
    await mount("table-body");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("table-body")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("table-body");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
