// calendar-week-table.test.js
// CalendarWeekTable component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("table.calendar-week-table");


describe("CalendarWeekTable", () => {
  it("renders the element with its base class", async () => {
    await mount("calendar-week-table");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("calendar-week-table")).toBe(true);
  });

  it("uses the table element", async () => {
    await mount("calendar-week-table");
    expect(el().tagName.toLowerCase()).toBe("table");
  });
});
