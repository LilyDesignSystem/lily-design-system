// summary-box.test.js
// SummaryBox component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("aside.summary-box");


describe("SummaryBox", () => {
  it("renders the element with its base class", async () => {
    await mount("summary-box");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("summary-box")).toBe(true);
  });

  it("uses the aside element", async () => {
    await mount("summary-box");
    expect(el().tagName.toLowerCase()).toBe("aside");
  });
});
