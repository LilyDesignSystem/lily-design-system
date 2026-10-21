// date-time-view.test.js
// DateTimeView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("time.date-time-view");


describe("DateTimeView", () => {
  it("renders the element with its base class", async () => {
    await mount("date-time-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("date-time-view")).toBe(true);
  });

  it("uses the time element", async () => {
    await mount("date-time-view");
    expect(el().tagName.toLowerCase()).toBe("time");
  });
});
