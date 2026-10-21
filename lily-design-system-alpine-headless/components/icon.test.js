// icon.test.js
// Icon component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.icon");


describe("Icon", () => {
  it("renders the element with its base class", async () => {
    await mount("icon");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("icon")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("icon");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
