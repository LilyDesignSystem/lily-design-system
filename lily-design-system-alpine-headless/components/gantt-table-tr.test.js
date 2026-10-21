// gantt-table-tr.test.js
// GanttTableTr component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("tr.gantt-table-tr");


describe("GanttTableTr", () => {
  it("renders the element with its base class", async () => {
    await mount("gantt-table-tr");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("gantt-table-tr")).toBe(true);
  });

  it("uses the tr element", async () => {
    await mount("gantt-table-tr");
    expect(el().tagName.toLowerCase()).toBe("tr");
  });
});
