// sverige-personnummer-view.test.js
// SverigePersonnummerView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.sverige-personnummer-view");


describe("SverigePersonnummerView", () => {
  it("renders the element with its base class", async () => {
    await mount("sverige-personnummer-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("sverige-personnummer-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("sverige-personnummer-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
