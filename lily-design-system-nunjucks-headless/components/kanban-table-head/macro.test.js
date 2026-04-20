import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("kanban-table-head", () => {
  it("renders a <thead> with the base class", () => {
    const { document } = render("kanban-table-head", {});
    expect(document.querySelector("thead.kanban-table-head")).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("kanban-table-head", { classes: "sticky" });
    expect(document.querySelector("thead.kanban-table-head.sticky")).toBeTruthy();
  });

  it("renders caller block content", () => {
    const { document } = render(
      "kanban-table-head",
      {},
      '<tr class="kanban-table-row"><th>H</th></tr>',
    );
    expect(document.querySelector("thead tr.kanban-table-row")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("kanban-table-head", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
