// data-table-td.test.js
// DataTableTD component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("td.data-table-td");


describe("DataTableTD", () => {
  it("renders the element with its base class", async () => {
    await mount("data-table-td");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("data-table-td")).toBe(true);
  });

  it("uses the td element", async () => {
    await mount("data-table-td");
    expect(el().tagName.toLowerCase()).toBe("td");
  });
});
