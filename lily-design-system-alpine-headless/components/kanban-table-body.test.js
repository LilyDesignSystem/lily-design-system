// kanban-table-body.test.js
// KanbanTableBody component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("tbody.kanban-table-body");


describe("KanbanTableBody", () => {
  it("renders the element with its base class", async () => {
    await mount("kanban-table-body");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("kanban-table-body")).toBe(true);
  });

  it("uses the tbody element", async () => {
    await mount("kanban-table-body");
    expect(el().tagName.toLowerCase()).toBe("tbody");
  });
});
