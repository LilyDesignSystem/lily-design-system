// gantt-table-tfoot.test.js
// GanttTableTfoot component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("tfoot.gantt-table-tfoot");


describe("GanttTableTfoot", () => {
  it("renders the element with its base class", async () => {
    await mount("gantt-table-tfoot");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("gantt-table-tfoot")).toBe(true);
  });

  it("uses the tfoot element", async () => {
    await mount("gantt-table-tfoot");
    expect(el().tagName.toLowerCase()).toBe("tfoot");
  });
});
