// data-table-row.test.js
// DataTableRow component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("tr.data-table-row");


describe("DataTableRow", () => {
  it("renders the element with its base class", async () => {
    await mount("data-table-row");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("data-table-row")).toBe(true);
  });

  it("uses the tr element", async () => {
    await mount("data-table-row");
    expect(el().tagName.toLowerCase()).toBe("tr");
  });
});
