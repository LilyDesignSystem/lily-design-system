import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("tour-list", () => {
  it("renders an <ol> with the base class", () => {
    const { document } = render("tour-list", {});
    expect(document.querySelector("ol.tour-list")).toBeTruthy();
  });

  it("renders caller content", () => {
    const { document } = render(
      "tour-list",
      {},
      '<li class="tour-list-item"></li>',
    );
    expect(
      document.querySelector("ol.tour-list li.tour-list-item"),
    ).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("tour-list", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
