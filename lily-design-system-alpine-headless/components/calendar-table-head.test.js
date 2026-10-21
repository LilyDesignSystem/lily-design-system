// calendar-table-head.test.js
// CalendarTableHead component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("thead.calendar-table-head");


describe("CalendarTableHead", () => {
  it("renders the element with its base class", async () => {
    await mount("calendar-table-head");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("calendar-table-head")).toBe(true);
  });

  it("uses the thead element", async () => {
    await mount("calendar-table-head");
    expect(el().tagName.toLowerCase()).toBe("thead");
  });
});
