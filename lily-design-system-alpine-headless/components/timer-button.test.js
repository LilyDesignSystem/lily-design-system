// timer-button.test.js
// TimerButton component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("button.timer-button");


describe("TimerButton", () => {
  it("renders the element with its base class", async () => {
    await mount("timer-button");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("timer-button")).toBe(true);
  });

  it("uses the button element", async () => {
    await mount("timer-button");
    expect(el().tagName.toLowerCase()).toBe("button");
  });
});
