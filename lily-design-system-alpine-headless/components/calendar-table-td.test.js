// calendar-table-td.test.js
// CalendarTableTD component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("td.calendar-table-td");


describe("CalendarTableTD", () => {
  it("renders the element with its base class", async () => {
    await mount("calendar-table-td");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("calendar-table-td")).toBe(true);
  });

  it("uses the td element", async () => {
    await mount("calendar-table-td");
    expect(el().tagName.toLowerCase()).toBe("td");
  });
});
