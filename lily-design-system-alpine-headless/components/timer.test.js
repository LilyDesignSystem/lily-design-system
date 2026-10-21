// timer.test.js
// Timer component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("time.timer");


describe("Timer", () => {
  it("renders the element with its base class", async () => {
    await mount("timer");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("timer")).toBe(true);
  });

  it("is a <time> with role=timer", async () => {
    await mount("timer");
    expect(el().tagName).toBe("TIME");
    expect(el().getAttribute("role")).toBe("timer");
  });
});
