// calendar-table.test.js
// CalendarTable component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("table.calendar-table");


describe("CalendarTable", () => {
  it("renders the element with its base class", async () => {
    await mount("calendar-table");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("calendar-table")).toBe(true);
  });

  it("uses the table element", async () => {
    await mount("calendar-table");
    expect(el().tagName.toLowerCase()).toBe("table");
  });
});
