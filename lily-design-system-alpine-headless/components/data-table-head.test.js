// data-table-head.test.js
// DataTableHead component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("thead.data-table-head");


describe("DataTableHead", () => {
  it("renders the element with its base class", async () => {
    await mount("data-table-head");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("data-table-head")).toBe(true);
  });

  it("uses the thead element", async () => {
    await mount("data-table-head");
    expect(el().tagName.toLowerCase()).toBe("thead");
  });
});
