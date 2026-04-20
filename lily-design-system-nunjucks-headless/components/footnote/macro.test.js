import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("footnote", () => {
  it("renders a <sup> with the base class wrapping an <a>", () => {
    const { document } = render("footnote", {
      number: 1,
      href: "#fn-1",
      id: "fnref-1",
    });
    const sup = document.querySelector("sup.footnote");
    expect(sup).toBeTruthy();
    expect(sup.getAttribute("id")).toBe("fnref-1");
    const a = sup.querySelector("a");
    expect(a.getAttribute("href")).toBe("#fn-1");
    expect(a.textContent).toBe("1");
  });

  it("accepts a string marker", () => {
    const { document } = render("footnote", {
      number: "a",
      href: "#fn-a",
    });
    expect(document.querySelector("sup.footnote a").textContent).toBe("a");
  });

  it("defaults href to '#' when omitted", () => {
    const { document } = render("footnote", { number: 1 });
    expect(document.querySelector("sup.footnote a").getAttribute("href"))
      .toBe("#");
  });

  it("sets aria-label on the link when provided", () => {
    const { document } = render("footnote", {
      number: 1,
      href: "#fn-1",
      label: "Footnote 1: see source",
    });
    expect(document.querySelector("sup.footnote a").getAttribute("aria-label"))
      .toBe("Footnote 1: see source");
  });

  it("appends params.classes", () => {
    const { document } = render("footnote", {
      number: 1,
      classes: "inline",
    });
    expect(document.querySelector("sup.footnote.inline")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("footnote", { number: 1 });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
