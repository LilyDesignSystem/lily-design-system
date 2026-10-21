// kanban-table.test.js
// KanbanTable component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("table.kanban-table");


describe("KanbanTable", () => {
  it("renders the element with its base class", async () => {
    await mount("kanban-table");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("kanban-table")).toBe(true);
  });

  it("uses the table element", async () => {
    await mount("kanban-table");
    expect(el().tagName.toLowerCase()).toBe("table");
  });
});
