// segment-group-item.test.js
// SegmentGroupItem component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("button.segment-group-item");


describe("SegmentGroupItem", () => {
  it("renders the element with its base class", async () => {
    await mount("segment-group-item");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("segment-group-item")).toBe(true);
  });

  it("uses the button element", async () => {
    await mount("segment-group-item");
    expect(el().tagName.toLowerCase()).toBe("button");
  });
});
