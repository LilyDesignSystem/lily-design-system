import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("data-table", () => {
  it("renders a <table> with the base class", () => {
    const { document } = render("data-table", {});
    expect(document.querySelector("table.data-table")).toBeTruthy();
  });

  it("renders a <caption> when params.caption is provided", () => {
    const { document } = render("data-table", { caption: "Appointments" });
    const c = document.querySelector("table caption.data-table-caption");
    expect(c).toBeTruthy();
    expect(c.textContent.trim()).toBe("Appointments");
  });

  it("renders captionHtml raw", () => {
    const { document } = render("data-table", {
      captionHtml: "<strong>Appointments</strong>",
    });
    expect(document.querySelector("table caption strong")).toBeTruthy();
  });

  it("uses aria-label only when no caption is provided", () => {
    const { document } = render("data-table", { label: "Appointments" });
    expect(document.querySelector("table").getAttribute("aria-label"))
      .toBe("Appointments");
  });

  it("omits aria-label when a caption is provided", () => {
    const { document } = render("data-table", {
      caption: "Visible caption",
      label: "Hidden label",
    });
    expect(document.querySelector("table").hasAttribute("aria-label")).toBe(false);
  });

  it("prefers aria-labelledby over aria-label when both apply", () => {
    const { document } = render("data-table", {
      label: "Fallback",
      labelledBy: "h",
    });
    const el = document.querySelector("table");
    expect(el.getAttribute("aria-labelledby")).toBe("h");
    expect(el.hasAttribute("aria-label")).toBe(false);
  });

  it("appends params.classes", () => {
    const { document } = render("data-table", { classes: "striped" });
    expect(document.querySelector("table.data-table.striped")).toBeTruthy();
  });

  it("renders caller block content", () => {
    const { document } = render(
      "data-table",
      {},
      "<thead><tr><th>H</th></tr></thead>",
    );
    expect(document.querySelector("table thead th").textContent).toBe("H");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("data-table", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
