// bulgaria-edinen-grazhdanski-nomer-view.test.js
// BulgariaEdinenGrazhdanskiNomerView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.bulgaria-edinen-grazhdanski-nomer-view");


describe("BulgariaEdinenGrazhdanskiNomerView", () => {
  it("renders the element with its base class", async () => {
    await mount("bulgaria-edinen-grazhdanski-nomer-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("bulgaria-edinen-grazhdanski-nomer-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("bulgaria-edinen-grazhdanski-nomer-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
