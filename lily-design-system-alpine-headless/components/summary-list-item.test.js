// summary-list-item.test.js
// SummaryListItem component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("li.summary-list-item");


describe("SummaryListItem", () => {
  it("renders the element with its base class", async () => {
    await mount("summary-list-item");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("summary-list-item")).toBe(true);
  });

  it("uses the li element", async () => {
    await mount("summary-list-item");
    expect(el().tagName.toLowerCase()).toBe("li");
  });
});
