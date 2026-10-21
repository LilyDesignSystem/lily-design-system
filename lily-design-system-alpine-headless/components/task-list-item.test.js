// task-list-item.test.js
// TaskListItem component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("li.task-list-item");


describe("TaskListItem", () => {
  it("renders the element with its base class", async () => {
    await mount("task-list-item");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("task-list-item")).toBe(true);
  });

  it("uses the li element", async () => {
    await mount("task-list-item");
    expect(el().tagName.toLowerCase()).toBe("li");
  });
});
