import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("data-table-th", () => {
  it("renders a <th> with the base class and default scope", () => {
    const { document } = render("data-table-th", { text: "Name" });
    const el = document.querySelector("th.data-table-th");
    expect(el).toBeTruthy();
    expect(el.getAttribute("scope")).toBe("col");
    expect(el.textContent.trim()).toBe("Name");
  });

  it("escapes params.text", () => {
    const { document } = render("data-table-th", { text: "A & B" });
    expect(document.querySelector("th").textContent.trim()).toBe("A & B");
  });

  it("renders params.html raw", () => {
    const { document } = render("data-table-th", {
      html: "<abbr>BP</abbr>",
    });
    expect(document.querySelector("th abbr")).toBeTruthy();
  });

  it("supports scope='row'", () => {
    const { document } = render("data-table-th", {
      text: "Patient",
      scope: "row",
    });
    expect(document.querySelector("th").getAttribute("scope")).toBe("row");
  });

  it("renders colspan, rowspan, abbr", () => {
    const { document } = render("data-table-th", {
      text: "x",
      colspan: 2,
      rowspan: 3,
      abbr: "BP",
    });
    const el = document.querySelector("th");
    expect(el.getAttribute("colspan")).toBe("2");
    expect(el.getAttribute("rowspan")).toBe("3");
    expect(el.getAttribute("abbr")).toBe("BP");
  });

  it("appends params.classes", () => {
    const { document } = render("data-table-th", {
      text: "x",
      classes: "table-col-numeric",
    });
    expect(document.querySelector("th.data-table-th.table-col-numeric")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("data-table-th", { text: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
