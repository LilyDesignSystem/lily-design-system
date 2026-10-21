// tag.test.js
// Tag component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.tag");


describe("Tag", () => {
  it("renders the element with its base class", async () => {
    await mount("tag");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("tag")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("tag");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
