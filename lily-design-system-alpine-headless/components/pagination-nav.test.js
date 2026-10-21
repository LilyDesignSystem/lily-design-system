// pagination-nav.test.js
// PaginationNav component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("nav.pagination-nav");


describe("PaginationNav", () => {
  it("renders the element with its base class", async () => {
    await mount("pagination-nav");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("pagination-nav")).toBe(true);
  });

  it("uses the nav element", async () => {
    await mount("pagination-nav");
    expect(el().tagName.toLowerCase()).toBe("nav");
  });
});
