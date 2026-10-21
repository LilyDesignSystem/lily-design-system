// document-list-item.test.js
// DocumentListItem component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("li.document-list-item");


describe("DocumentListItem", () => {
  it("renders the element with its base class", async () => {
    await mount("document-list-item");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("document-list-item")).toBe(true);
  });

  it("uses the li element", async () => {
    await mount("document-list-item");
    expect(el().tagName.toLowerCase()).toBe("li");
  });
});
