import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("calendar-table-body", () => {
  it("renders a <tbody> with the base class", () => {
    const { document } = render("calendar-table-body", {});
    expect(document.querySelector("tbody.calendar-table-body")).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("calendar-table-body", { classes: "scroll" });
    expect(document.querySelector("tbody.calendar-table-body.scroll")).toBeTruthy();
  });

  it("renders caller block content", () => {
    const { document } = render(
      "calendar-table-body",
      {},
      '<tr class="calendar-table-row"><td>v</td></tr>',
    );
    expect(document.querySelector("tbody tr.calendar-table-row")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("calendar-table-body", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
