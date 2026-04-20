import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("caption", () => {
  it("renders a <figcaption> with the base class by default", () => {
    const { document } = render("caption", { text: "Figure 1" });
    expect(document.querySelector("figcaption.caption")).toBeTruthy();
  });

  it("switches to <caption> when params.as='caption'", () => {
    // Wrap result in a <table> for jsdom to parse <caption> — our
    // render helper auto-wraps when the first tag is a table part.
    // For a <caption> standalone, we need to manually check via
    // the html string because jsdom hoists <caption> outside when
    // no parent table is present.
    const { html } = render("caption", {
      as: "caption",
      text: "Table 1",
    });
    expect(html.trim().startsWith("<caption")).toBe(true);
    expect(html).toContain('class="caption"');
  });

  it("escapes params.text", () => {
    const { document } = render("caption", { text: "A & B" });
    expect(document.querySelector("figcaption.caption").textContent.trim())
      .toBe("A & B");
  });

  it("renders params.html raw", () => {
    const { document } = render("caption", {
      html: "<strong>Figure 1</strong>",
    });
    expect(document.querySelector("figcaption.caption strong")).toBeTruthy();
  });

  it("sets aria-label when provided", () => {
    const { document } = render("caption", {
      text: "x",
      label: "Figure 1 caption",
    });
    expect(document.querySelector("figcaption.caption").getAttribute("aria-label"))
      .toBe("Figure 1 caption");
  });

  it("appends params.classes", () => {
    const { document } = render("caption", {
      text: "x",
      classes: "small",
    });
    expect(document.querySelector("figcaption.caption.small")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("caption", { text: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
