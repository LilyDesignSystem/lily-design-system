// streaming-text.test.js
// StreamingText component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.streaming-text");


describe("StreamingText", () => {
  it("renders the element with its base class", async () => {
    await mount("streaming-text");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("streaming-text")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("streaming-text");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
