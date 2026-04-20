import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("calendar-table-col", () => {
  it("renders a <th> with the base class and default scope", () => {
    const { document } = render("calendar-table-col", { text: "Name" });
    const el = document.querySelector("th.calendar-table-col");
    expect(el).toBeTruthy();
    expect(el.getAttribute("scope")).toBe("col");
    expect(el.textContent.trim()).toBe("Name");
  });

  it("escapes params.text", () => {
    const { document } = render("calendar-table-col", { text: "A & B" });
    expect(document.querySelector("th").textContent.trim()).toBe("A & B");
  });

  it("renders params.html raw", () => {
    const { document } = render("calendar-table-col", {
      html: "<abbr>BP</abbr>",
    });
    expect(document.querySelector("th abbr")).toBeTruthy();
  });

  it("supports scope='row'", () => {
    const { document } = render("calendar-table-col", {
      text: "Patient",
      scope: "row",
    });
    expect(document.querySelector("th").getAttribute("scope")).toBe("row");
  });

  it("renders colspan, rowspan, abbr", () => {
    const { document } = render("calendar-table-col", {
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
    const { document } = render("calendar-table-col", {
      text: "x",
      classes: "table-col-numeric",
    });
    expect(document.querySelector("th.calendar-table-col.table-col-numeric")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("calendar-table-col", { text: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
