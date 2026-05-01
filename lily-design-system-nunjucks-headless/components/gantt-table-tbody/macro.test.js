import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("gantt-table-tbody", () => {
  it("renders a <tbody> with the base class", () => {
    const { document } = render("gantt-table-tbody", {});
    expect(document.querySelector("tbody.gantt-table-tbody")).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("gantt-table-tbody", { classes: "scroll" });
    expect(document.querySelector("tbody.gantt-table-tbody.scroll")).toBeTruthy();
  });

  it("renders caller block content", () => {
    const { document } = render(
      "gantt-table-tbody",
      {},
      '<tr class="gantt-table-tr"><td>v</td></tr>',
    );
    expect(document.querySelector("tbody tr.gantt-table-tr")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("gantt-table-tbody", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
