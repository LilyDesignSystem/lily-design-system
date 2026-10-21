// kanban-table-foot.test.js
// KanbanTableFoot component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("tfoot.kanban-table-foot");


describe("KanbanTableFoot", () => {
  it("renders the element with its base class", async () => {
    await mount("kanban-table-foot");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("kanban-table-foot")).toBe(true);
  });

  it("uses the tfoot element", async () => {
    await mount("kanban-table-foot");
    expect(el().tagName.toLowerCase()).toBe("tfoot");
  });
});
