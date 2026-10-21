// kanban-table-head.test.js
// KanbanTableHead component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("thead.kanban-table-head");


describe("KanbanTableHead", () => {
  it("renders the element with its base class", async () => {
    await mount("kanban-table-head");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("kanban-table-head")).toBe(true);
  });

  it("uses the thead element", async () => {
    await mount("kanban-table-head");
    expect(el().tagName.toLowerCase()).toBe("thead");
  });
});
