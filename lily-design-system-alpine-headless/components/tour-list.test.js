// tour-list.test.js
// TourList component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("ol.tour-list");


describe("TourList", () => {
  it("renders the element with its base class", async () => {
    await mount("tour-list");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("tour-list")).toBe(true);
  });

  it("uses the ol element", async () => {
    await mount("tour-list");
    expect(el().tagName.toLowerCase()).toBe("ol");
  });
});
