import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("gantt-table-body", () => {
  it("renders a <tbody> with the base class", () => {
    const { document } = render("gantt-table-body", {});
    expect(document.querySelector("tbody.gantt-table-body")).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("gantt-table-body", { classes: "scroll" });
    expect(document.querySelector("tbody.gantt-table-body.scroll")).toBeTruthy();
  });

  it("renders caller block content", () => {
    const { document } = render(
      "gantt-table-body",
      {},
      '<tr class="gantt-table-row"><td>v</td></tr>',
    );
    expect(document.querySelector("tbody tr.gantt-table-row")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("gantt-table-body", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
