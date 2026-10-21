// description-list-item.test.js
// DescriptionListItem component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.description-list-item");


describe("DescriptionListItem", () => {
  it("renders the element with its base class", async () => {
    await mount("description-list-item");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("description-list-item")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("description-list-item");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
