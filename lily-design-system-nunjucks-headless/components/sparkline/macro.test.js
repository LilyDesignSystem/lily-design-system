import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("sparkline", () => {
  it("renders an <svg role=img> with a polyline", () => {
    const { document } = render("sparkline", {
      values: [1, 3, 2, 5, 4],
      label: "Heart rate",
    });
    const svg = document.querySelector("svg.sparkline");
    expect(svg).toBeTruthy();
    expect(svg.getAttribute("role")).toBe("img");
    expect(svg.getAttribute("aria-label")).toBe("Heart rate");
    expect(svg.querySelector("polyline")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("sparkline", { values: [1, 2, 3] });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
