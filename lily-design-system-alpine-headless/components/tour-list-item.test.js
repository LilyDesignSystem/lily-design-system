// tour-list-item.test.js
// TourListItem component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("li.tour-list-item");


describe("TourListItem", () => {
  it("renders the element with its base class", async () => {
    await mount("tour-list-item");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("tour-list-item")).toBe(true);
  });

  it("uses the li element", async () => {
    await mount("tour-list-item");
    expect(el().tagName.toLowerCase()).toBe("li");
  });
});
