// pagination-list-item.test.js
// PaginationListItem component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("li.pagination-list-item");


describe("PaginationListItem", () => {
  it("renders the element with its base class", async () => {
    await mount("pagination-list-item");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("pagination-list-item")).toBe(true);
  });

  it("uses the li element", async () => {
    await mount("pagination-list-item");
    expect(el().tagName.toLowerCase()).toBe("li");
  });
});
