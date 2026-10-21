// kanban-table-row.test.js
// KanbanTableRow component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("tr.kanban-table-row");


describe("KanbanTableRow", () => {
  it("renders the element with its base class", async () => {
    await mount("kanban-table-row");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("kanban-table-row")).toBe(true);
  });

  it("uses the tr element", async () => {
    await mount("kanban-table-row");
    expect(el().tagName.toLowerCase()).toBe("tr");
  });
});
