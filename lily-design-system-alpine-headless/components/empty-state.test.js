// empty-state.test.js
// EmptyState component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.empty-state");


describe("EmptyState", () => {
  it("renders the element with its base class", async () => {
    await mount("empty-state");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("empty-state")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("empty-state");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
