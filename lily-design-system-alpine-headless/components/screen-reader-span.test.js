// screen-reader-span.test.js
// ScreenReaderSpan component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.screen-reader-span");


describe("ScreenReaderSpan", () => {
  it("renders the element with its base class", async () => {
    await mount("screen-reader-span");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("screen-reader-span")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("screen-reader-span");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
