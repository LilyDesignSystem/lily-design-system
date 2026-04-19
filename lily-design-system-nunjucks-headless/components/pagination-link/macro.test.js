import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("pagination-link", () => {
  it("renders an <a> with the base class", () => {
    const { document } = render("pagination-link", {
      href: "?page=1",
      text: "1",
    });
    const el = document.querySelector("a.pagination-link");
    expect(el).toBeTruthy();
    expect(el.getAttribute("href")).toBe("?page=1");
    expect(el.textContent.trim()).toBe("1");
  });

  it("defaults href to '#' when omitted", () => {
    const { document } = render("pagination-link", { text: "1" });
    expect(document.querySelector("a").getAttribute("href")).toBe("#");
  });

  it("sets aria-current='page' when current is true", () => {
    const { document } = render("pagination-link", {
      href: "?page=2",
      text: "2",
      current: true,
    });
    expect(document.querySelector("a").getAttribute("aria-current"))
      .toBe("page");
  });

  it("omits aria-current when current is falsy", () => {
    const { document } = render("pagination-link", { text: "1" });
    expect(document.querySelector("a").hasAttribute("aria-current")).toBe(false);
  });

  it("sets data-direction for previous/next", () => {
    const { document: a } = render("pagination-link", {
      text: "Prev",
      direction: "previous",
    });
    expect(a.querySelector("a").getAttribute("data-direction")).toBe("previous");
    const { document: b } = render("pagination-link", {
      text: "Next",
      direction: "next",
    });
    expect(b.querySelector("a").getAttribute("data-direction")).toBe("next");
  });

  it("renders a visually-hidden hiddenLabel suffix", () => {
    const { document } = render("pagination-link", {
      text: "Next",
      direction: "next",
      hiddenLabel: "page: 3",
    });
    const hidden = document.querySelector("a span.visually-hidden");
    expect(hidden).toBeTruthy();
    expect(hidden.textContent.trim()).toBe("page: 3");
  });

  it("uses params.label as aria-label when provided", () => {
    const { document } = render("pagination-link", {
      text: "2",
      label: "Go to page 2",
    });
    expect(document.querySelector("a").getAttribute("aria-label"))
      .toBe("Go to page 2");
  });

  it("appends params.classes", () => {
    const { document } = render("pagination-link", {
      text: "1",
      classes: "first",
    });
    expect(document.querySelector("a.pagination-link.first")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("pagination-link", { text: "1" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
