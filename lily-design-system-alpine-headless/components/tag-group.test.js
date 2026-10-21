// tag-group.test.js
// TagGroup component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.tag-group");


describe("TagGroup", () => {
  it("renders the element with its base class", async () => {
    await mount("tag-group");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("tag-group")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("tag-group");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
