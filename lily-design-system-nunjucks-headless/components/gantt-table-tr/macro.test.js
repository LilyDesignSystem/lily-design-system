import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("gantt-table-tr", () => {
  it("renders a <tr> with the base class", () => {
    const { document } = render("gantt-table-tr", {});
    expect(document.querySelector("tr.gantt-table-tr")).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("gantt-table-tr", { classes: "highlight" });
    expect(document.querySelector("tr.gantt-table-tr.highlight")).toBeTruthy();
  });

  it("renders caller block content", () => {
    const { document } = render(
      "gantt-table-tr",
      {},
      '<td class="gantt-table-td">x</td>',
    );
    expect(document.querySelector("tr td.gantt-table-td").textContent).toBe("x");
  });

  it("renders params.attributes", () => {
    const { document } = render("gantt-table-tr", {
      attributes: { "data-row-id": "42" },
    });
    expect(document.querySelector("tr").getAttribute("data-row-id")).toBe("42");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("gantt-table-tr", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
