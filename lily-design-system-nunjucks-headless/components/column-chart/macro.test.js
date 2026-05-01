import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("column-chart", () => {
  it("renders a <figure> with the base class", () => {
    const { document } = render("column-chart", { label: "Test", text: "Content" });
    const el = document.querySelector(".column-chart");
    expect(el).toBeTruthy();
  });

  it("appends params.classes to the root element", () => {
    const { document } = render("column-chart", { label: "Test", classes: "extra" });
    const el = document.querySelector(".column-chart.extra");
    expect(el).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("column-chart", { label: "Test" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
