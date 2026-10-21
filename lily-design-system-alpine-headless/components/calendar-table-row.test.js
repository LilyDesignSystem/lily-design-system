// calendar-table-row.test.js
// CalendarTableRow component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("tr.calendar-table-row");


describe("CalendarTableRow", () => {
  it("renders the element with its base class", async () => {
    await mount("calendar-table-row");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("calendar-table-row")).toBe(true);
  });

  it("uses the tr element", async () => {
    await mount("calendar-table-row");
    expect(el().tagName.toLowerCase()).toBe("tr");
  });
});
