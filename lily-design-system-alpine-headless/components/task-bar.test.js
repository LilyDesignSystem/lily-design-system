// task-bar.test.js
// TaskBar component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.task-bar");


describe("TaskBar", () => {
  it("renders the element with its base class", async () => {
    await mount("task-bar");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("task-bar")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("task-bar");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});
