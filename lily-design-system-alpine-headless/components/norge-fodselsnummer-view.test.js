// norge-fodselsnummer-view.test.js
// NorgeFodselsnummerView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.norge-fodselsnummer-view");


describe("NorgeFodselsnummerView", () => {
  it("renders the element with its base class", async () => {
    await mount("norge-fodselsnummer-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("norge-fodselsnummer-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("norge-fodselsnummer-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
