// breadcrumb-nav.test.js
// BreadcrumbNav component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("nav.breadcrumb-nav");


describe("BreadcrumbNav", () => {
  it("renders the element with its base class", async () => {
    await mount("breadcrumb-nav");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("breadcrumb-nav")).toBe(true);
  });

  it("uses the nav element", async () => {
    await mount("breadcrumb-nav");
    expect(el().tagName.toLowerCase()).toBe("nav");
  });
});
