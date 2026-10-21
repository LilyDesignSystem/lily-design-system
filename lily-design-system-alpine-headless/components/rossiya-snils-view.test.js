// rossiya-snils-view.test.js
// RossiyaSnilsView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.rossiya-snils-view");


describe("RossiyaSnilsView", () => {
  it("renders the element with its base class", async () => {
    await mount("rossiya-snils-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("rossiya-snils-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("rossiya-snils-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
