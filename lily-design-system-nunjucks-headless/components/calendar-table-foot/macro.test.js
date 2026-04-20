import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("calendar-table-foot", () => {
  it("renders a <tfoot> with the base class", () => {
    const { document } = render("calendar-table-foot", {});
    expect(document.querySelector("tfoot.calendar-table-foot")).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("calendar-table-foot", { classes: "totals" });
    expect(document.querySelector("tfoot.calendar-table-foot.totals")).toBeTruthy();
  });

  it("renders caller block content", () => {
    const { document } = render(
      "calendar-table-foot",
      {},
      '<tr class="calendar-table-row"><td>sum</td></tr>',
    );
    expect(document.querySelector("tfoot tr.calendar-table-row")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("calendar-table-foot", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
