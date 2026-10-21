// gantt-table-tbody.test.js
// GanttTableTbody component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("tbody.gantt-table-tbody");


describe("GanttTableTbody", () => {
  it("renders the element with its base class", async () => {
    await mount("gantt-table-tbody");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("gantt-table-tbody")).toBe(true);
  });

  it("uses the tbody element", async () => {
    await mount("gantt-table-tbody");
    expect(el().tagName.toLowerCase()).toBe("tbody");
  });
});
