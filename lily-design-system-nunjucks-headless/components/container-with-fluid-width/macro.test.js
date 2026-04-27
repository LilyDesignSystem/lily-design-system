import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("container-with-fluid-width", () => {
  it("renders a <div> with the base class and default padding-inline", () => {
    const { document } = render("container-with-fluid-width", {});
    const el = document.querySelector("div.container-with-fluid-width");
    expect(el).toBeTruthy();
    expect(el.getAttribute("data-padding-inline")).toBe("1rem");
    expect(el.getAttribute("style")).toContain("width: 100%");
    expect(el.getAttribute("style")).toContain("padding-inline: 1rem");
  });

  it("respects a custom paddingInline", () => {
    const { document } = render("container-with-fluid-width", {
      paddingInline: "2rem",
    });
    const el = document.querySelector("div.container-with-fluid-width");
    expect(el.getAttribute("data-padding-inline")).toBe("2rem");
    expect(el.getAttribute("style")).toContain("padding-inline: 2rem");
  });

  it("renders caller content", () => {
    const { document } = render(
      "container-with-fluid-width",
      {},
      "<p>Body</p>",
    );
    expect(document.querySelector("div.container-with-fluid-width p"))
      .toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("container-with-fluid-width", {
      classes: "wide",
    });
    expect(document.querySelector("div.container-with-fluid-width.wide"))
      .toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render("container-with-fluid-width", {
      attributes: { "data-test": "x" },
    });
    expect(
      document
        .querySelector("div.container-with-fluid-width")
        .getAttribute("data-test"),
    ).toBe("x");
  });

  it("contains no <script> tag", () => {
    const { html } = render("container-with-fluid-width", {});
    expect(html).not.toContain("<script");
  });
});
