import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

const name = "calendar-day-table";
const p = { label: "Monday 3 March 2025" };

describe("calendar-day-table", () => {
  it("renders a <table> with the base class", () => {
    const { document } = render(name, p);
    expect(document.querySelector("table.calendar-day-table")).toBeTruthy();
  });

  it("has role=grid", () => {
    const { document } = render(name, p);
    expect(document.querySelector("table").getAttribute("role")).toBe("grid");
  });

  it("sets aria-label from label", () => {
    const { document } = render(name, p);
    expect(document.querySelector("table").getAttribute("aria-label")).toBe("Monday 3 March 2025");
  });

  it("marks the view as data-view=day", () => {
    const { document } = render(name, p);
    expect(document.querySelector("table").getAttribute("data-view")).toBe("day");
  });

  it("puts the base class first, then the consumer class", () => {
    const { document } = render(name, { ...p, classes: "mine" });
    expect(document.querySelector("table").getAttribute("class")).toBe("calendar-day-table mine");
  });

  it("renders caption when provided", () => {
    const { document } = render(name, { ...p, caption: "Visible caption" });
    expect(document.querySelector("table caption").textContent).toBe("Visible caption");
  });

  it("renders captionHtml raw", () => {
    const { document } = render(name, { ...p, captionHtml: "<strong>Cap</strong>" });
    expect(document.querySelector("table caption strong")).toBeTruthy();
  });

  it("renders without caption by default", () => {
    const { document } = render(name, p);
    expect(document.querySelector("table caption")).toBeNull();
  });

  it("renders caller block content", () => {
    const { document } = render(name, p, "<tbody><tr><td>15</td></tr></tbody>");
    expect(document.querySelector("table td").textContent).toBe("15");
  });

  it("renders params.html raw", () => {
    const { document } = render(name, { ...p, html: "<tbody><tr><td>7</td></tr></tbody>" });
    expect(document.querySelector("table td").textContent).toBe("7");
  });

  it("passes attributes and id through to the table", () => {
    const { document } = render(name, { ...p, id: "cal", attributes: { "data-testid": "cal" } });
    const el = document.querySelector("table");
    expect(el.id).toBe("cal");
    expect(el.getAttribute("data-testid")).toBe("cal");
  });

  it("contains no <style> or <script> tags or inline styles", () => {
    const { html } = render(name, p);
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
