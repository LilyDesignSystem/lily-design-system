import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("section-heading", () => {
  it("renders a <header> with the base class", () => {
    const { document } = render("section-heading", { heading: "Hello" });
    expect(document.querySelector("header.section-heading")).toBeTruthy();
  });

  it("defaults the heading level to <h2>", () => {
    const { document } = render("section-heading", { heading: "Hello" });
    expect(document.querySelector("header h2.section-heading-heading")
      .textContent).toBe("Hello");
  });

  it("renders an <h3> when level is 3", () => {
    const { document } = render("section-heading", {
      heading: "Hello",
      level: 3,
    });
    expect(document.querySelector("header h3.section-heading-heading"))
      .toBeTruthy();
  });

  it("renders an <h4> when level is 4", () => {
    const { document } = render("section-heading", {
      heading: "Hello",
      level: 4,
    });
    expect(document.querySelector("header h4.section-heading-heading"))
      .toBeTruthy();
  });

  it("renders an <h5> when level is 5", () => {
    const { document } = render("section-heading", {
      heading: "Hello",
      level: 5,
    });
    expect(document.querySelector("header h5.section-heading-heading"))
      .toBeTruthy();
  });

  it("renders an <h6> when level is 6", () => {
    const { document } = render("section-heading", {
      heading: "Hello",
      level: 6,
    });
    expect(document.querySelector("header h6.section-heading-heading"))
      .toBeTruthy();
  });

  it("renders the eyebrow when provided", () => {
    const { document } = render("section-heading", {
      heading: "Hello",
      eyebrow: "Why us",
    });
    expect(document.querySelector("p.section-heading-eyebrow").textContent)
      .toBe("Why us");
  });

  it("omits the eyebrow when not provided", () => {
    const { document } = render("section-heading", { heading: "Hello" });
    expect(document.querySelector(".section-heading-eyebrow")).toBeFalsy();
  });

  it("renders the subtitle when provided", () => {
    const { document } = render("section-heading", {
      heading: "Hello",
      subtitle: "Sub",
    });
    expect(document.querySelector("p.section-heading-subtitle").textContent)
      .toBe("Sub");
  });

  it("omits the subtitle when not provided", () => {
    const { document } = render("section-heading", { heading: "Hello" });
    expect(document.querySelector(".section-heading-subtitle")).toBeFalsy();
  });

  it("orders eyebrow, heading, subtitle correctly", () => {
    const { document } = render("section-heading", {
      heading: "Title",
      eyebrow: "Eye",
      subtitle: "Sub",
    });
    const children = Array.from(document.querySelector("header").children);
    expect(children.map((c) => c.tagName.toLowerCase()))
      .toEqual(["p", "h2", "p"]);
  });

  it("appends params.classes", () => {
    const { document } = render("section-heading", {
      heading: "Hello",
      classes: "centered",
    });
    expect(document.querySelector("header.section-heading.centered"))
      .toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render("section-heading", {
      heading: "Hello",
      attributes: { "data-test": "x" },
    });
    expect(document.querySelector("header").getAttribute("data-test"))
      .toBe("x");
  });

  it("contains no <style> tag", () => {
    const { html } = render("section-heading", { heading: "Hello" });
    expect(html).not.toContain("<style");
  });
});
