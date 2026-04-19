import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("summary-list", () => {
  it("renders a <dl> with the base class", () => {
    const { document } = render(
      "summary-list",
      {},
      '<div class="summary-list-item"><dt>K</dt><dd>V</dd></div>',
    );
    const el = document.querySelector("dl.summary-list");
    expect(el).toBeTruthy();
  });

  it("sets aria-label from params.label", () => {
    const { document } = render("summary-list", { label: "Your answers" });
    expect(document.querySelector("dl.summary-list").getAttribute("aria-label"))
      .toBe("Your answers");
  });

  it("prefers aria-labelledby over aria-label", () => {
    const { document } = render("summary-list", {
      label: "Fallback",
      labelledBy: "h",
    });
    const el = document.querySelector("dl.summary-list");
    expect(el.getAttribute("aria-labelledby")).toBe("h");
    expect(el.hasAttribute("aria-label")).toBe(false);
  });

  it("appends params.classes", () => {
    const { document } = render("summary-list", { classes: "no-border" });
    expect(document.querySelector("dl.summary-list.no-border")).toBeTruthy();
  });

  it("renders caller block content", () => {
    const { document } = render(
      "summary-list",
      {},
      '<div class="summary-list-item">inner</div>',
    );
    expect(document.querySelector("dl .summary-list-item").textContent)
      .toBe("inner");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("summary-list", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
