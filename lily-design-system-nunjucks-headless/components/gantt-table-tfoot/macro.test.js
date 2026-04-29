import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("gantt-table-foot", () => {
  it("renders a <tfoot> with the base class", () => {
    const { document } = render("gantt-table-foot", {});
    expect(document.querySelector("tfoot.gantt-table-foot")).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("gantt-table-foot", { classes: "totals" });
    expect(document.querySelector("tfoot.gantt-table-foot.totals")).toBeTruthy();
  });

  it("renders caller block content", () => {
    const { document } = render(
      "gantt-table-foot",
      {},
      '<tr class="gantt-table-row"><td>sum</td></tr>',
    );
    expect(document.querySelector("tfoot tr.gantt-table-row")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("gantt-table-foot", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
