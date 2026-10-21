// kanban-table-th.test.js
// KanbanTableTH component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("th.kanban-table-th");


describe("KanbanTableTH", () => {
  it("renders the element with its base class", async () => {
    await mount("kanban-table-th");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("kanban-table-th")).toBe(true);
  });

  it("uses the th element", async () => {
    await mount("kanban-table-th");
    expect(el().tagName.toLowerCase()).toBe("th");
  });
});
