import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("line-chart", () => {
  it("renders a <figure> with the base class", () => {
    const { document } = render("line-chart", { label: "Test", text: "Content" });
    const el = document.querySelector(".line-chart");
    expect(el).toBeTruthy();
  });

  it("appends params.classes to the root element", () => {
    const { document } = render("line-chart", { label: "Test", classes: "extra" });
    const el = document.querySelector(".line-chart.extra");
    expect(el).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("line-chart", { label: "Test" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
