import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("table-head", () => {
  it("renders a <thead> with the base class", () => {
    const { document } = render("table-head", {});
    expect(document.querySelector("thead.table-head")).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("table-head", { classes: "sticky" });
    expect(document.querySelector("thead.table-head.sticky")).toBeTruthy();
  });

  it("renders caller block content", () => {
    const { document } = render(
      "table-head",
      {},
      '<tr class="table-row"><th>H</th></tr>',
    );
    expect(document.querySelector("thead tr.table-row")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("table-head", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
