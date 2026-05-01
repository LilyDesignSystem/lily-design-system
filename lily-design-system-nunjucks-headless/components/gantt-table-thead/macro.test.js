import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("gantt-table-thead", () => {
  it("renders a <thead> with the base class", () => {
    const { document } = render("gantt-table-thead", {});
    expect(document.querySelector("thead.gantt-table-thead")).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("gantt-table-thead", { classes: "sticky" });
    expect(document.querySelector("thead.gantt-table-thead.sticky")).toBeTruthy();
  });

  it("renders caller block content", () => {
    const { document } = render(
      "gantt-table-thead",
      {},
      '<tr class="gantt-table-row"><th>H</th></tr>',
    );
    expect(document.querySelector("thead tr.gantt-table-row")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("gantt-table-thead", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
