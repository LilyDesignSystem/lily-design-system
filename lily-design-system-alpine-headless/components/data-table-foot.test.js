// data-table-foot.test.js
// DataTableFoot component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("tfoot.data-table-foot");


describe("DataTableFoot", () => {
  it("renders the element with its base class", async () => {
    await mount("data-table-foot");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("data-table-foot")).toBe(true);
  });

  it("uses the tfoot element", async () => {
    await mount("data-table-foot");
    expect(el().tagName.toLowerCase()).toBe("tfoot");
  });
});
