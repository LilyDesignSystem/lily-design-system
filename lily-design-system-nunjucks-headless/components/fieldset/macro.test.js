import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("fieldset", () => {
  it("renders a <fieldset> with the base class and a <legend>", () => {
    const { document } = render("fieldset", { legend: "Address" });
    const el = document.querySelector("fieldset.fieldset");
    expect(el).toBeTruthy();
    const legend = document.querySelector("fieldset.fieldset legend.fieldset-legend");
    expect(legend).toBeTruthy();
    expect(legend.textContent.trim()).toBe("Address");
  });

  it("renders legendHtml raw", () => {
    const { document } = render("fieldset", {
      legendHtml: "<strong>Address</strong>",
    });
    expect(
      document.querySelector("fieldset.fieldset legend strong").textContent,
    ).toBe("Address");
  });

  it("wraps the legend content in <h1> when isPageHeading is true", () => {
    const { document } = render("fieldset", {
      legend: "Address",
      isPageHeading: true,
    });
    const h = document.querySelector("fieldset legend.fieldset-legend h1.fieldset-heading");
    expect(h).toBeTruthy();
    expect(h.textContent.trim()).toBe("Address");
  });

  it("sets aria-describedby when describedBy is provided", () => {
    const { document } = render("fieldset", {
      legend: "x",
      describedBy: "hint-id",
    });
    expect(
      document.querySelector("fieldset").getAttribute("aria-describedby"),
    ).toBe("hint-id");
  });

  it("sets disabled when disabled is true", () => {
    const { document } = render("fieldset", {
      legend: "x",
      disabled: true,
    });
    expect(document.querySelector("fieldset").hasAttribute("disabled")).toBe(true);
  });

  it("appends params.classes", () => {
    const { document } = render("fieldset", {
      legend: "x",
      classes: "inline",
    });
    expect(document.querySelector("fieldset.fieldset.inline")).toBeTruthy();
  });

  it("renders caller block after the legend", () => {
    const { document } = render(
      "fieldset",
      { legend: "x" },
      '<div class="field">Inner</div>',
    );
    expect(document.querySelector("fieldset .field").textContent).toBe("Inner");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("fieldset", { legend: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
