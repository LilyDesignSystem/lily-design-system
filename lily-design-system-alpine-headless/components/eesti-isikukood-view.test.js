// eesti-isikukood-view.test.js
// EestiIsikukoodView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.eesti-isikukood-view");


describe("EestiIsikukoodView", () => {
  it("renders the element with its base class", async () => {
    await mount("eesti-isikukood-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("eesti-isikukood-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("eesti-isikukood-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
