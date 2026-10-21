// calendar-year-table.test.js
// CalendarYearTable component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("table.calendar-year-table");


describe("CalendarYearTable", () => {
  it("renders the element with its base class", async () => {
    await mount("calendar-year-table");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("calendar-year-table")).toBe(true);
  });

  it("uses the table element", async () => {
    await mount("calendar-year-table");
    expect(el().tagName.toLowerCase()).toBe("table");
  });
});
