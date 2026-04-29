import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("kanban-table-td", () => {
  it("renders a <td> with the base class", () => {
    const { document } = render("kanban-table-td", { text: "v" });
    const el = document.querySelector("td.kanban-table-td");
    expect(el).toBeTruthy();
    expect(el.textContent.trim()).toBe("v");
  });

  it("escapes params.text", () => {
    const { document } = render("kanban-table-td", { text: "A & B" });
    expect(document.querySelector("td").textContent.trim()).toBe("A & B");
  });

  it("renders params.html raw", () => {
    const { document } = render("kanban-table-td", {
      html: "<a href='#'>link</a>",
    });
    expect(document.querySelector("td a")).toBeTruthy();
  });

  it("renders colspan, rowspan, headers", () => {
    const { document } = render("kanban-table-td", {
      text: "x",
      colspan: 2,
      rowspan: 3,
      headers: "h1 h2",
    });
    const el = document.querySelector("td");
    expect(el.getAttribute("colspan")).toBe("2");
    expect(el.getAttribute("rowspan")).toBe("3");
    expect(el.getAttribute("headers")).toBe("h1 h2");
  });

  it("appends params.classes", () => {
    const { document } = render("kanban-table-td", {
      text: "x",
      classes: "table-data-numeric",
    });
    expect(document.querySelector("td.kanban-table-td.table-data-numeric")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("kanban-table-td", { text: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
