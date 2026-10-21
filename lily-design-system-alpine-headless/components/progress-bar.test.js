// progress-bar.test.js
// ProgressBar component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.progress-bar");


describe("ProgressBar", () => {
  it("renders the element with its base class", async () => {
    await mount("progress-bar");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("progress-bar")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("progress-bar");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
