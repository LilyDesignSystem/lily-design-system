import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("calendar-table-row", () => {
  it("renders a <tr> with the base class", () => {
    const { document } = render("calendar-table-row", {});
    expect(document.querySelector("tr.calendar-table-row")).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("calendar-table-row", { classes: "highlight" });
    expect(document.querySelector("tr.calendar-table-row.highlight")).toBeTruthy();
  });

  it("renders caller block content", () => {
    const { document } = render(
      "calendar-table-row",
      {},
      '<td class="calendar-table-td">x</td>',
    );
    expect(document.querySelector("tr td.calendar-table-td").textContent).toBe("x");
  });

  it("renders params.attributes", () => {
    const { document } = render("calendar-table-row", {
      attributes: { "data-row-id": "42" },
    });
    expect(document.querySelector("tr").getAttribute("data-row-id")).toBe("42");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("calendar-table-row", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
