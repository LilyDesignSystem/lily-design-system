import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("data-table-head", () => {
  it("renders a <thead> with the base class", () => {
    const { document } = render("data-table-head", {});
    expect(document.querySelector("thead.data-table-head")).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("data-table-head", { classes: "sticky" });
    expect(document.querySelector("thead.data-table-head.sticky")).toBeTruthy();
  });

  it("renders caller block content", () => {
    const { document } = render(
      "data-table-head",
      {},
      '<tr class="data-table-row"><th>H</th></tr>',
    );
    expect(document.querySelector("thead tr.data-table-row")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("data-table-head", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
