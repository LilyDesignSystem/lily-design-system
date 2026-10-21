// task-bar-button.test.js
// TaskBarButton component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("button.task-bar-button");


describe("TaskBarButton", () => {
  it("renders the element with its base class", async () => {
    await mount("task-bar-button");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("task-bar-button")).toBe(true);
  });

  it("uses the button element", async () => {
    await mount("task-bar-button");
    expect(el().tagName.toLowerCase()).toBe("button");
  });
});
