import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("flair", () => {
  it("renders a <span> with the base class", () => {
    const { document } = render("flair", { text: "NEW" });
    expect(document.querySelector("span.flair")).toBeTruthy();
  });

  it("sets aria-hidden='true' when decorative", () => {
    const { document } = render("flair", {
      text: "★",
      decorative: true,
    });
    const el = document.querySelector("span.flair");
    expect(el.getAttribute("aria-hidden")).toBe("true");
    expect(el.hasAttribute("aria-label")).toBe(false);
  });

  it("sets aria-label when provided", () => {
    const { document } = render("flair", {
      text: "NEW",
      label: "New feature",
    });
    expect(document.querySelector("span.flair").getAttribute("aria-label"))
      .toBe("New feature");
  });

  it("ignores label when decorative is true", () => {
    const { document } = render("flair", {
      text: "★",
      decorative: true,
      label: "ignored",
    });
    const el = document.querySelector("span.flair");
    expect(el.getAttribute("aria-hidden")).toBe("true");
    expect(el.hasAttribute("aria-label")).toBe(false);
  });

  it("escapes text and renders html raw", () => {
    const { document: a } = render("flair", { text: "A & B" });
    expect(a.querySelector("span.flair").textContent.trim()).toBe("A & B");

    const { document: b } = render("flair", {
      html: "<em>New</em>",
    });
    expect(b.querySelector("span.flair em")).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("flair", { text: "NEW", classes: "accent" });
    expect(document.querySelector("span.flair.accent")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("flair", { text: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
