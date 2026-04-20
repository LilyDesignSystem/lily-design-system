import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("data-table-foot", () => {
  it("renders a <tfoot> with the base class", () => {
    const { document } = render("data-table-foot", {});
    expect(document.querySelector("tfoot.data-table-foot")).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("data-table-foot", { classes: "totals" });
    expect(document.querySelector("tfoot.data-table-foot.totals")).toBeTruthy();
  });

  it("renders caller block content", () => {
    const { document } = render(
      "data-table-foot",
      {},
      '<tr class="data-table-row"><td>sum</td></tr>',
    );
    expect(document.querySelector("tfoot tr.data-table-row")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("data-table-foot", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
