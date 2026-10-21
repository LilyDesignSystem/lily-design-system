// calendar-table-body.test.js
// CalendarTableBody component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("tbody.calendar-table-body");


describe("CalendarTableBody", () => {
  it("renders the element with its base class", async () => {
    await mount("calendar-table-body");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("calendar-table-body")).toBe(true);
  });

  it("uses the tbody element", async () => {
    await mount("calendar-table-body");
    expect(el().tagName.toLowerCase()).toBe("tbody");
  });
});
