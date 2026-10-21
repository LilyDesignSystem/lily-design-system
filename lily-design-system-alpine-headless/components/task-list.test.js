// task-list.test.js
// TaskList component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("ol.task-list");


describe("TaskList", () => {
  it("renders the element with its base class", async () => {
    await mount("task-list");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("task-list")).toBe(true);
  });

  it("uses the ol element", async () => {
    await mount("task-list");
    expect(el().tagName.toLowerCase()).toBe("ol");
  });
});
