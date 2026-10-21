// timeline-list.test.js
// TimelineList component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("ol.timeline-list");


describe("TimelineList", () => {
  it("renders the element with its base class", async () => {
    await mount("timeline-list");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("timeline-list")).toBe(true);
  });

  it("uses the ol element", async () => {
    await mount("timeline-list");
    expect(el().tagName.toLowerCase()).toBe("ol");
  });
});
