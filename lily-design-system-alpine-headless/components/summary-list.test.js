// summary-list.test.js
// SummaryList component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("ol.summary-list");


describe("SummaryList", () => {
  it("renders the element with its base class", async () => {
    await mount("summary-list");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("summary-list")).toBe(true);
  });

  it("uses the ol element", async () => {
    await mount("summary-list");
    expect(el().tagName.toLowerCase()).toBe("ol");
  });
});
