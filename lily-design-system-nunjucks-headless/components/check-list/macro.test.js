import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("check-list", () => {
  it("renders an <ol> with the base class", () => {
    const { document } = render("check-list", {});
    expect(document.querySelector("ol.check-list")).toBeTruthy();
  });

  it("respects params.label", () => {
    const { document } = render("check-list", { label: "Checklist" });
    expect(document.querySelector("ol.check-list").getAttribute("aria-label"))
      .toBe("Checklist");
  });

  it("renders caller content", () => {
    const { document } = render(
      "check-list",
      {},
      '<li class="check-list-item"></li>',
    );
    expect(
      document.querySelector("ol.check-list li.check-list-item"),
    ).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("check-list", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
