// net-promoter-score-view.test.js
// NetPromoterScoreView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.net-promoter-score-view");


describe("NetPromoterScoreView", () => {
  it("renders the element with its base class", async () => {
    await mount("net-promoter-score-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("net-promoter-score-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("net-promoter-score-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
