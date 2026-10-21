// data-table.test.js
// DataTable component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("table.data-table");


describe("DataTable", () => {
  it("renders the element with its base class", async () => {
    await mount("data-table");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("data-table")).toBe(true);
  });

  it("uses the table element", async () => {
    await mount("data-table");
    expect(el().tagName.toLowerCase()).toBe("table");
  });
});
