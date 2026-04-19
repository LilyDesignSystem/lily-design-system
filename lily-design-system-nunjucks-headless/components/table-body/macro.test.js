import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("table-body", () => {
  it("renders a <tbody> with the base class", () => {
    const { document } = render("table-body", {});
    expect(document.querySelector("tbody.table-body")).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("table-body", { classes: "scroll" });
    expect(document.querySelector("tbody.table-body.scroll")).toBeTruthy();
  });

  it("renders caller block content", () => {
    const { document } = render(
      "table-body",
      {},
      '<tr class="table-row"><td>v</td></tr>',
    );
    expect(document.querySelector("tbody tr.table-row")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("table-body", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
