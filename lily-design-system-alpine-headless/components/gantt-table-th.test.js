// gantt-table-th.test.js
// GanttTableTH component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("th.gantt-table-th");


describe("GanttTableTH", () => {
  it("renders the element with its base class", async () => {
    await mount("gantt-table-th");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("gantt-table-th")).toBe(true);
  });

  it("uses the th element", async () => {
    await mount("gantt-table-th");
    expect(el().tagName.toLowerCase()).toBe("th");
  });
});
