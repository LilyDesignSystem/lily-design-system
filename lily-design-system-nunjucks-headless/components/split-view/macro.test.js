import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("split-view", () => {
  it("renders a <div> with the base class and aria-label", () => {
    const { document } = render("split-view", {
      label: "Files and preview",
      primaryHtml: "<nav>files</nav>",
      secondaryHtml: "<article>preview</article>",
    });
    const el = document.querySelector("div.split-view");
    expect(el).toBeTruthy();
    expect(el.getAttribute("aria-label")).toBe("Files and preview");
  });

  it("defaults orientation to horizontal and split percent to 50", () => {
    const { document } = render("split-view", {
      label: "x",
      primaryHtml: "<p></p>",
      secondaryHtml: "<p></p>",
    });
    const el = document.querySelector("div.split-view");
    expect(el.getAttribute("data-orientation")).toBe("horizontal");
    expect(el.getAttribute("data-split-percent")).toBe("50");
  });

  it("respects orientation and splitPercent params", () => {
    const { document } = render("split-view", {
      label: "x",
      orientation: "vertical",
      splitPercent: 30,
      primaryHtml: "<p></p>",
      secondaryHtml: "<p></p>",
    });
    const el = document.querySelector("div.split-view");
    expect(el.getAttribute("data-orientation")).toBe("vertical");
    expect(el.getAttribute("data-split-percent")).toBe("30");
  });

  it("renders the primary and secondary panels with correct content", () => {
    const { document } = render("split-view", {
      label: "x",
      primaryHtml: '<nav class="files">F</nav>',
      secondaryHtml: '<article class="preview">P</article>',
    });
    expect(document.querySelector(".split-view-primary .files")).toBeTruthy();
    expect(document.querySelector(".split-view-secondary .preview")).toBeTruthy();
  });

  it("renders a default divider with role=separator and ARIA values", () => {
    const { document } = render("split-view", {
      label: "x",
      orientation: "vertical",
      splitPercent: 25,
      primaryHtml: "<p></p>",
      secondaryHtml: "<p></p>",
    });
    const divider = document.querySelector(".split-view-divider");
    expect(divider).toBeTruthy();
    expect(divider.getAttribute("role")).toBe("separator");
    expect(divider.getAttribute("aria-orientation")).toBe("vertical");
    expect(divider.getAttribute("aria-valuenow")).toBe("25");
    expect(divider.getAttribute("aria-valuemin")).toBe("0");
    expect(divider.getAttribute("aria-valuemax")).toBe("100");
    expect(divider.getAttribute("tabindex")).toBe("0");
  });

  it("renders a custom divider when dividerHtml is provided", () => {
    const { document } = render("split-view", {
      label: "x",
      primaryHtml: "<p></p>",
      secondaryHtml: "<p></p>",
      dividerHtml: '<button class="my-handle" type="button" role="separator">drag</button>',
    });
    expect(document.querySelector(".my-handle")).toBeTruthy();
    expect(document.querySelector(".split-view-divider")).toBeNull();
  });

  it("appends params.classes", () => {
    const { document } = render("split-view", {
      label: "x",
      primaryHtml: "<p></p>",
      secondaryHtml: "<p></p>",
      classes: "compact",
    });
    expect(document.querySelector("div.split-view.compact")).toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render("split-view", {
      label: "x",
      primaryHtml: "<p></p>",
      secondaryHtml: "<p></p>",
      attributes: { "data-test": "x" },
    });
    expect(document.querySelector("div.split-view").getAttribute("data-test"))
      .toBe("x");
  });

  it("contains no <style> tag", () => {
    const { html } = render("split-view", {
      label: "x",
      primaryHtml: "<p></p>",
      secondaryHtml: "<p></p>",
    });
    expect(html).not.toContain("<style");
  });
});
