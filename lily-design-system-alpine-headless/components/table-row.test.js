// table-row.test.js
// TableRow component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.table-row");


describe("TableRow", () => {
  it("renders the element with its base class", async () => {
    await mount("table-row");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("table-row")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("table-row");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
