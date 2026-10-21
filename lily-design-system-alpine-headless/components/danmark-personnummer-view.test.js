// danmark-personnummer-view.test.js
// DanmarkPersonnummerView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.danmark-personnummer-view");


describe("DanmarkPersonnummerView", () => {
  it("renders the element with its base class", async () => {
    await mount("danmark-personnummer-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("danmark-personnummer-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("danmark-personnummer-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
