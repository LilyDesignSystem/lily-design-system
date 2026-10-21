// red-amber-green-view.test.js
// RedAmberGreenView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.red-amber-green-view");


describe("RedAmberGreenView", () => {
  it("renders the element with its base class", async () => {
    await mount("red-amber-green-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("red-amber-green-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("red-amber-green-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
