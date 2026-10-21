// pagination-link.test.js
// PaginationLink component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("a.pagination-link");


describe("PaginationLink", () => {
  it("renders the element with its base class", async () => {
    await mount("pagination-link");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("pagination-link")).toBe(true);
  });

  it("uses the a element", async () => {
    await mount("pagination-link");
    expect(el().tagName.toLowerCase()).toBe("a");
  });
});
