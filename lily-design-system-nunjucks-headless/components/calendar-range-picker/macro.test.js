import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("calendar-range-picker", () => {
  it("renders a <div role=group> with start and end date inputs", () => {
    const { document } = render("calendar-range-picker", {
      id: "range",
      label: "Appointment range",
      start: "2026-04-20",
      end: "2026-04-25",
    });
    const el = document.querySelector("div.calendar-range-picker");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("group");
    expect(document.querySelector(".calendar-range-picker-start").getAttribute("value"))
      .toBe("2026-04-20");
    expect(document.querySelector(".calendar-range-picker-end").getAttribute("value"))
      .toBe("2026-04-25");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("calendar-range-picker", { id: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
