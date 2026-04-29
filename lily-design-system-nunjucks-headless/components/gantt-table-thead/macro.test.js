import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("gantt-table-head", () => {
  it("renders a <thead> with the base class", () => {
    const { document } = render("gantt-table-head", {});
    expect(document.querySelector("thead.gantt-table-head")).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("gantt-table-head", { classes: "sticky" });
    expect(document.querySelector("thead.gantt-table-head.sticky")).toBeTruthy();
  });

  it("renders caller block content", () => {
    const { document } = render(
      "gantt-table-head",
      {},
      '<tr class="gantt-table-row"><th>H</th></tr>',
    );
    expect(document.querySelector("thead tr.gantt-table-row")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("gantt-table-head", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
