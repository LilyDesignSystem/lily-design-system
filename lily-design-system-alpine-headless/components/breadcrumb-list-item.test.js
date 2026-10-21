// breadcrumb-list-item.test.js
// BreadcrumbListItem component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("li.breadcrumb-list-item");


describe("BreadcrumbListItem", () => {
  it("renders the element with its base class", async () => {
    await mount("breadcrumb-list-item");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("breadcrumb-list-item")).toBe(true);
  });

  it("uses the li element", async () => {
    await mount("breadcrumb-list-item");
    expect(el().tagName.toLowerCase()).toBe("li");
  });
});
