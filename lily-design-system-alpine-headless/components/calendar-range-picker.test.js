// calendar-range-picker.test.js
// CalendarRangePicker component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.calendar-range-picker");


describe("CalendarRangePicker", () => {
  it("renders the element with its base class", async () => {
    await mount("calendar-range-picker");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("calendar-range-picker")).toBe(true);
  });

  it('is role="application" with an accessible name', async () => {
    await mount("calendar-range-picker");
    expect(el().getAttribute("role")).toBe("application");
    expect(el().hasAttribute("aria-label")).toBe(true);
  });
});
