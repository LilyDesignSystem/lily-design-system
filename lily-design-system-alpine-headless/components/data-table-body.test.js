// data-table-body.test.js
// DataTableBody component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("tbody.data-table-body");


describe("DataTableBody", () => {
  it("renders the element with its base class", async () => {
    await mount("data-table-body");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("data-table-body")).toBe(true);
  });

  it("uses the tbody element", async () => {
    await mount("data-table-body");
    expect(el().tagName.toLowerCase()).toBe("tbody");
  });
});
