// pagination-list.test.js
// PaginationList component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("ol.pagination-list");


describe("PaginationList", () => {
  it("renders the element with its base class", async () => {
    await mount("pagination-list");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("pagination-list")).toBe(true);
  });

  it("uses the ol element", async () => {
    await mount("pagination-list");
    expect(el().tagName.toLowerCase()).toBe("ol");
  });
});
