// gantt-table.test.js
// GanttTable component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("table.gantt-table");


describe("GanttTable", () => {
  it("renders the element with its base class", async () => {
    await mount("gantt-table");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("gantt-table")).toBe(true);
  });

  it("uses the table element", async () => {
    await mount("gantt-table");
    expect(el().tagName.toLowerCase()).toBe("table");
  });
});
