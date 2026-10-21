// badge.test.js
// Badge component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.badge");


describe("Badge", () => {
  it("renders the element with its base class", async () => {
    await mount("badge");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("badge")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("badge");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
