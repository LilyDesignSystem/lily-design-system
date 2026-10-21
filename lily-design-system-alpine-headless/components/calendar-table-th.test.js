// calendar-table-th.test.js
// CalendarTableTH component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("th.calendar-table-th");


describe("CalendarTableTH", () => {
  it("renders the element with its base class", async () => {
    await mount("calendar-table-th");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("calendar-table-th")).toBe(true);
  });

  it("uses the th element", async () => {
    await mount("calendar-table-th");
    expect(el().tagName.toLowerCase()).toBe("th");
  });
});
