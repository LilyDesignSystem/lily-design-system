import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("segment-group", () => {
  it("renders a <div role=radiogroup> with the base class", () => {
    const { document } = render("segment-group", { label: "View" });
    const el = document.querySelector("div.segment-group");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("radiogroup");
    expect(el.getAttribute("aria-label")).toBe("View");
  });

  it("prefers aria-labelledby over aria-label", () => {
    const { document } = render("segment-group", {
      label: "x",
      labelledBy: "h",
    });
    const el = document.querySelector("div.segment-group");
    expect(el.getAttribute("aria-labelledby")).toBe("h");
    expect(el.hasAttribute("aria-label")).toBe(false);
  });

  it("renders caller block content", () => {
    const { document } = render(
      "segment-group",
      { label: "x" },
      '<button class="segment-group-item">Day</button>',
    );
    expect(document.querySelector("div.segment-group .segment-group-item"))
      .toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("segment-group", {
      label: "x",
      classes: "inline",
    });
    expect(document.querySelector("div.segment-group.inline")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("segment-group", { label: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
