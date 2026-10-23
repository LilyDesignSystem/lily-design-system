import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

const name = "heatmap-chart-with-year-of-days";
const svg = '<svg data-testid="art" viewBox="0 0 10 10"><circle r="4"></circle></svg>';
const table = '<table><caption>Values</caption><tbody><tr><th scope="row">A</th><td>1</td></tr></tbody></table>';

describe("heatmap-chart-with-year-of-days", () => {
  it("renders a <figure> with the base class", () => {
    const { document } = render(name, { label: "Test", year: 2026, weekStart: 0, html: svg });
    expect(document.querySelector("figure.heatmap-chart-with-year-of-days")).toBeTruthy();
  });

  it("exposes the graphic as a single named image, not the figure", () => {
    const { document } = render(name, { label: "Test", year: 2026, weekStart: 0, html: svg });
    const g = document.querySelector("[role=img]");
    expect(g.tagName).toBe("DIV");
    expect(g.getAttribute("class")).toBe("heatmap-chart-with-year-of-days-graphic");
    expect(g.getAttribute("aria-label")).toBe("Test");
    expect(document.querySelector("figure").hasAttribute("role")).toBe(false);
  });

  it("puts the base class first, then the consumer class", () => {
    const { document } = render(name, { label: "T", year: 2026, weekStart: 0, classes: "mine", html: svg });
    expect(document.querySelector("figure").getAttribute("class")).toBe("heatmap-chart-with-year-of-days mine");
  });

  it("renders the consumer svg via params.html inside the graphic", () => {
    const { document } = render(name, { label: "T", year: 2026, weekStart: 0, html: svg });
    expect(document.querySelector("[role=img] > svg")).toBeTruthy();
  });

  it("sets aria-describedby on the graphic from describedBy", () => {
    const { document } = render(name, { label: "T", year: 2026, weekStart: 0, describedBy: "desc", html: svg });
    expect(document.querySelector("[role=img]").getAttribute("aria-describedby")).toBe("desc");
  });

  it("renders no data-table wrapper without params.dataTable", () => {
    const { document } = render(name, { label: "T", year: 2026, weekStart: 0, html: svg });
    expect(document.querySelector(".heatmap-chart-with-year-of-days-data-table")).toBeNull();
  });

  it("renders params.dataTable in a sibling after the graphic, outside role=img", () => {
    const { document } = render(name, { label: "T", year: 2026, weekStart: 0, html: svg, dataTable: table });
    const wrap = document.querySelector(".heatmap-chart-with-year-of-days-data-table");
    expect(wrap.querySelector("table")).toBeTruthy();
    expect(wrap.previousElementSibling).toBe(document.querySelector(".heatmap-chart-with-year-of-days-graphic"));
    expect(wrap.parentElement.tagName).toBe("FIGURE");
    expect(document.querySelector("[role=img] table")).toBeNull();
  });

  it("sets id and extra attributes on the figure", () => {
    const { document } = render(name, { label: "T", year: 2026, weekStart: 0, id: "c1", attributes: { "data-x": "1" }, html: svg });
    const f = document.querySelector("figure");
    expect(f.getAttribute("id")).toBe("c1");
    expect(f.getAttribute("data-x")).toBe("1");
  });

  it("renders the consumer svg via the caller block", () => {
    const { document } = render(name, { label: "T", year: 2026, weekStart: 0 }, svg);
    expect(document.querySelector("[role=img] > svg")).toBeTruthy();
  });

  it("omits aria-describedby by default", () => {
    const { document } = render(name, { label: "T", year: 2026, weekStart: 0, html: svg });
    expect(document.querySelector("[role=img]").hasAttribute("aria-describedby")).toBe(false);
  });

  it("contains no <style> or <script> tags or inline styles", () => {
    const { html } = render(name, { label: "T", year: 2026, weekStart: 0, html: svg, dataTable: table });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });

  it("reflects year and weekStart as data attributes on the figure", () => {
    const { document } = render(name, { label: "T", year: 2025, weekStart: 1, html: svg });
    const fig = document.querySelector("figure");
    expect(fig.getAttribute("data-year")).toBe("2025");
    expect(fig.getAttribute("data-week-start")).toBe("1");
  });
});
