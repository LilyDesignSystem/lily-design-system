// breadcrumb-list.test.js
// BreadcrumbList component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("ol.breadcrumb-list");


describe("BreadcrumbList", () => {
  it("renders the element with its base class", async () => {
    await mount("breadcrumb-list");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("breadcrumb-list")).toBe(true);
  });

  it("uses the ol element", async () => {
    await mount("breadcrumb-list");
    expect(el().tagName.toLowerCase()).toBe("ol");
  });
});
