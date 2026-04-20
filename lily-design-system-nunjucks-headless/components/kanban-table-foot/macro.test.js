import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("kanban-table-foot", () => {
  it("renders a <tfoot> with the base class", () => {
    const { document } = render("kanban-table-foot", {});
    expect(document.querySelector("tfoot.kanban-table-foot")).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("kanban-table-foot", { classes: "totals" });
    expect(document.querySelector("tfoot.kanban-table-foot.totals")).toBeTruthy();
  });

  it("renders caller block content", () => {
    const { document } = render(
      "kanban-table-foot",
      {},
      '<tr class="kanban-table-row"><td>sum</td></tr>',
    );
    expect(document.querySelector("tfoot tr.kanban-table-row")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("kanban-table-foot", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
