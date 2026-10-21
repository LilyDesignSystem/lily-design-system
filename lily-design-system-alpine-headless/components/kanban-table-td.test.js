// kanban-table-td.test.js
// KanbanTableTD component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("td.kanban-table-td");


describe("KanbanTableTD", () => {
  it("renders the element with its base class", async () => {
    await mount("kanban-table-td");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("kanban-table-td")).toBe(true);
  });

  it("uses the td element", async () => {
    await mount("kanban-table-td");
    expect(el().tagName.toLowerCase()).toBe("td");
  });
});
