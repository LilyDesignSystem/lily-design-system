import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("container-with-fixed-width", () => {
  it("renders a <div> with the base class and default max-width", () => {
    const { document } = render("container-with-fixed-width", {});
    const el = document.querySelector("div.container-with-fixed-width");
    expect(el).toBeTruthy();
    expect(el.getAttribute("data-max-width")).toBe("1200px");
    expect(el.getAttribute("style")).toContain("max-width: 1200px");
    expect(el.getAttribute("style")).toContain("margin-inline: auto");
  });

  it("respects a custom maxWidth", () => {
    const { document } = render("container-with-fixed-width", {
      maxWidth: "960px",
    });
    const el = document.querySelector("div.container-with-fixed-width");
    expect(el.getAttribute("data-max-width")).toBe("960px");
    expect(el.getAttribute("style")).toContain("max-width: 960px");
  });

  it("renders caller content", () => {
    const { document } = render(
      "container-with-fixed-width",
      {},
      "<p>Inside</p>",
    );
    expect(document.querySelector("div.container-with-fixed-width p"))
      .toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("container-with-fixed-width", {
      classes: "narrow",
    });
    expect(document.querySelector("div.container-with-fixed-width.narrow"))
      .toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render("container-with-fixed-width", {
      attributes: { "data-test": "x" },
    });
    expect(
      document
        .querySelector("div.container-with-fixed-width")
        .getAttribute("data-test"),
    ).toBe("x");
  });

  it("contains no <script> tag", () => {
    const { html } = render("container-with-fixed-width", {});
    expect(html).not.toContain("<script");
  });
});
