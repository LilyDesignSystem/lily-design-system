import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("task-list", () => {
  it("renders an <ol> with the base class", () => {
    const { document } = render("task-list", {});
    expect(document.querySelector("ol.task-list")).toBeTruthy();
  });

  it("sets aria-label from params.label", () => {
    const { document } = render("task-list", { label: "Progress" });
    expect(document.querySelector("ol.task-list").getAttribute("aria-label"))
      .toBe("Progress");
  });

  it("prefers aria-labelledby over aria-label", () => {
    const { document } = render("task-list", {
      label: "Fallback",
      labelledBy: "h",
    });
    const el = document.querySelector("ol.task-list");
    expect(el.getAttribute("aria-labelledby")).toBe("h");
    expect(el.hasAttribute("aria-label")).toBe(false);
  });

  it("appends params.classes", () => {
    const { document } = render("task-list", { classes: "compact" });
    expect(document.querySelector("ol.task-list.compact")).toBeTruthy();
  });

  it("renders caller block content", () => {
    const { document } = render(
      "task-list",
      {},
      '<li class="task-list-item">One</li>',
    );
    expect(document.querySelector("ol .task-list-item")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("task-list", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
