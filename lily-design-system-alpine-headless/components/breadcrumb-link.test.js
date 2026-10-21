// breadcrumb-link.test.js
// BreadcrumbLink component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("a.breadcrumb-link");


describe("BreadcrumbLink", () => {
  it("renders the element with its base class", async () => {
    await mount("breadcrumb-link");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("breadcrumb-link")).toBe(true);
  });

  it("uses the a element", async () => {
    await mount("breadcrumb-link");
    expect(el().tagName.toLowerCase()).toBe("a");
  });
});
