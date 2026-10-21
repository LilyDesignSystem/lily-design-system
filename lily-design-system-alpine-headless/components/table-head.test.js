// table-head.test.js
// TableHead component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.table-head");


describe("TableHead", () => {
  it("renders the element with its base class", async () => {
    await mount("table-head");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("table-head")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("table-head");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
