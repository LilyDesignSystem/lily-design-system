// related-content.test.js
// RelatedContent component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("aside.related-content");


describe("RelatedContent", () => {
  it("renders the element with its base class", async () => {
    await mount("related-content");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("related-content")).toBe(true);
  });

  it("uses the aside element", async () => {
    await mount("related-content");
    expect(el().tagName.toLowerCase()).toBe("aside");
  });
});
