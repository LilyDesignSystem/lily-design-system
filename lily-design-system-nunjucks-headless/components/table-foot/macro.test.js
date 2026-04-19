import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("table-foot", () => {
  it("renders a <tfoot> with the base class", () => {
    const { document } = render("table-foot", {});
    expect(document.querySelector("tfoot.table-foot")).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("table-foot", { classes: "totals" });
    expect(document.querySelector("tfoot.table-foot.totals")).toBeTruthy();
  });

  it("renders caller block content", () => {
    const { document } = render(
      "table-foot",
      {},
      '<tr class="table-row"><td>sum</td></tr>',
    );
    expect(document.querySelector("tfoot tr.table-row")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("table-foot", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
