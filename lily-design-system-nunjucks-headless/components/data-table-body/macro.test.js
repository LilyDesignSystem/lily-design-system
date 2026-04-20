import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("data-table-body", () => {
  it("renders a <tbody> with the base class", () => {
    const { document } = render("data-table-body", {});
    expect(document.querySelector("tbody.data-table-body")).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("data-table-body", { classes: "scroll" });
    expect(document.querySelector("tbody.data-table-body.scroll")).toBeTruthy();
  });

  it("renders caller block content", () => {
    const { document } = render(
      "data-table-body",
      {},
      '<tr class="data-table-row"><td>v</td></tr>',
    );
    expect(document.querySelector("tbody tr.data-table-row")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("data-table-body", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
