// data-table-th.test.js
// DataTableTH component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("th.data-table-th");


describe("DataTableTH", () => {
  it("renders the element with its base class", async () => {
    await mount("data-table-th");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("data-table-th")).toBe(true);
  });

  it("uses the th element", async () => {
    await mount("data-table-th");
    expect(el().tagName.toLowerCase()).toBe("th");
  });
});
