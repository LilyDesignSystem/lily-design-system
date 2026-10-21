// island-kennitala-view.test.js
// IslandKennitalaView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.island-kennitala-view");


describe("IslandKennitalaView", () => {
  it("renders the element with its base class", async () => {
    await mount("island-kennitala-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("island-kennitala-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("island-kennitala-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
