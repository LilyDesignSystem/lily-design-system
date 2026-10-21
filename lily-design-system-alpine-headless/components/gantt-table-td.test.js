// gantt-table-td.test.js
// GanttTableTD component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("td.gantt-table-td");


describe("GanttTableTD", () => {
  it("renders the element with its base class", async () => {
    await mount("gantt-table-td");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("gantt-table-td")).toBe(true);
  });

  it("uses the td element", async () => {
    await mount("gantt-table-td");
    expect(el().tagName.toLowerCase()).toBe("td");
  });
});
