// gantt-table-thead.test.js
// GanttTableThead component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("thead.gantt-table-thead");


describe("GanttTableThead", () => {
  it("renders the element with its base class", async () => {
    await mount("gantt-table-thead");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("gantt-table-thead")).toBe(true);
  });

  it("uses the thead element", async () => {
    await mount("gantt-table-thead");
    expect(el().tagName.toLowerCase()).toBe("thead");
  });
});
