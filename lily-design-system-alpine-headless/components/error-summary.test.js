// error-summary.test.js
// ErrorSummary component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.error-summary");


describe("ErrorSummary", () => {
  it("renders the element with its base class", async () => {
    await mount("error-summary");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("error-summary")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("error-summary");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
