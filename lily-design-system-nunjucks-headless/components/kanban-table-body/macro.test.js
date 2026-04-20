import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("kanban-table-body", () => {
  it("renders a <tbody> with the base class", () => {
    const { document } = render("kanban-table-body", {});
    expect(document.querySelector("tbody.kanban-table-body")).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("kanban-table-body", { classes: "scroll" });
    expect(document.querySelector("tbody.kanban-table-body.scroll")).toBeTruthy();
  });

  it("renders caller block content", () => {
    const { document } = render(
      "kanban-table-body",
      {},
      '<tr class="kanban-table-row"><td>v</td></tr>',
    );
    expect(document.querySelector("tbody tr.kanban-table-row")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("kanban-table-body", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
