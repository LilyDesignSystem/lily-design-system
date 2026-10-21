// calendar-month-table.test.js
// CalendarMonthTable component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("table.calendar-month-table");


describe("CalendarMonthTable", () => {
  it("renders the element with its base class", async () => {
    await mount("calendar-month-table");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("calendar-month-table")).toBe(true);
  });

  it("uses the table element", async () => {
    await mount("calendar-month-table");
    expect(el().tagName.toLowerCase()).toBe("table");
  });
});
