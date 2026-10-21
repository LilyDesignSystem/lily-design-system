// progress-circle.test.js
// ProgressCircle component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.progress-circle");


describe("ProgressCircle", () => {
  it("renders the element with its base class", async () => {
    await mount("progress-circle");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("progress-circle")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("progress-circle");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
