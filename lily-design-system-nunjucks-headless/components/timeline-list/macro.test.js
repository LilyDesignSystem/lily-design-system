import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("timeline-list", () => {
  it("renders an <ol> with the base class", () => {
    const { document } = render("timeline-list", {});
    expect(document.querySelector("ol.timeline-list")).toBeTruthy();
  });

  it("respects params.label", () => {
    const { document } = render("timeline-list", { label: "History" });
    expect(document.querySelector("ol.timeline-list").getAttribute("aria-label"))
      .toBe("History");
  });

  it("renders caller content", () => {
    const { document } = render(
      "timeline-list",
      {},
      '<li class="timeline-list-item"></li>',
    );
    expect(
      document.querySelector("ol.timeline-list li.timeline-list-item"),
    ).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("timeline-list", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
