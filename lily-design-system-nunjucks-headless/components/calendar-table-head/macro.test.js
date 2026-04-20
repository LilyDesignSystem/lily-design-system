import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("calendar-table-head", () => {
  it("renders a <thead> with the base class", () => {
    const { document } = render("calendar-table-head", {});
    expect(document.querySelector("thead.calendar-table-head")).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("calendar-table-head", { classes: "sticky" });
    expect(document.querySelector("thead.calendar-table-head.sticky")).toBeTruthy();
  });

  it("renders caller block content", () => {
    const { document } = render(
      "calendar-table-head",
      {},
      '<tr class="calendar-table-row"><th>H</th></tr>',
    );
    expect(document.querySelector("thead tr.calendar-table-row")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("calendar-table-head", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
