import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("breadcrumb-list", () => {
  it("renders an <ol> with the base class", () => {
    const { document } = render("breadcrumb-list", {});
    const el = document.querySelector("ol");
    expect(el).toBeTruthy();
    expect(el.classList.contains("breadcrumb-list")).toBe(true);
  });

  it("appends params.classes", () => {
    const { document } = render("breadcrumb-list", { classes: "extra" });
    expect(document.querySelector("ol.breadcrumb-list.extra")).toBeTruthy();
  });

  it("renders caller block content", () => {
    const { document } = render(
      "breadcrumb-list",
      {},
      '<li class="breadcrumb-list-item">x</li>',
    );
    expect(document.querySelector("ol li.breadcrumb-list-item")).toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render("breadcrumb-list", {
      attributes: { "data-kind": "ancestors" },
    });
    expect(document.querySelector("ol").getAttribute("data-kind"))
      .toBe("ancestors");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("breadcrumb-list", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
