// calendar-day-table.test.js
// CalendarDayTable component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("table.calendar-day-table");


describe("CalendarDayTable", () => {
  it("renders the element with its base class", async () => {
    await mount("calendar-day-table");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("calendar-day-table")).toBe(true);
  });

  it("uses the table element", async () => {
    await mount("calendar-day-table");
    expect(el().tagName.toLowerCase()).toBe("table");
  });
});
