// warning-callout.test.js
// WarningCallout component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.warning-callout");


describe("WarningCallout", () => {
  it("renders the element with its base class", async () => {
    await mount("warning-callout");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("warning-callout")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("warning-callout");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
