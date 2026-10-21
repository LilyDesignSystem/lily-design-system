// timeline-list-item.test.js
// TimelineListItem component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("li.timeline-list-item");


describe("TimelineListItem", () => {
  it("renders the element with its base class", async () => {
    await mount("timeline-list-item");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("timeline-list-item")).toBe(true);
  });

  it("uses the li element", async () => {
    await mount("timeline-list-item");
    expect(el().tagName.toLowerCase()).toBe("li");
  });
});
