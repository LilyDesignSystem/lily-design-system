// calendar-table-foot.test.js
// CalendarTableFoot component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("tfoot.calendar-table-foot");


describe("CalendarTableFoot", () => {
  it("renders the element with its base class", async () => {
    await mount("calendar-table-foot");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("calendar-table-foot")).toBe(true);
  });

  it("uses the tfoot element", async () => {
    await mount("calendar-table-foot");
    expect(el().tagName.toLowerCase()).toBe("tfoot");
  });
});
