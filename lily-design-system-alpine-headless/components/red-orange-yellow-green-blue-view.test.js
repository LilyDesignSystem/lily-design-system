// red-orange-yellow-green-blue-view.test.js
// RedOrangeYellowGreenBlueView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.red-orange-yellow-green-blue-view");


describe("RedOrangeYellowGreenBlueView", () => {
  it("renders the element with its base class", async () => {
    await mount("red-orange-yellow-green-blue-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("red-orange-yellow-green-blue-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("red-orange-yellow-green-blue-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
