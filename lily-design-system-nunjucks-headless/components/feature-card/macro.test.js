import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("feature-card", () => {
  it("renders an <article> with the base class", () => {
    const { document } = render("feature-card", { heading: "Hello" });
    expect(document.querySelector("article.feature-card")).toBeTruthy();
  });

  it("renders the heading inside an <h3>", () => {
    const { document } = render("feature-card", { heading: "Privacy" });
    expect(document.querySelector("article h3.feature-card-heading").textContent)
      .toBe("Privacy");
  });

  it("uses heading as the default aria-label", () => {
    const { document } = render("feature-card", { heading: "Privacy" });
    expect(document.querySelector("article").getAttribute("aria-label"))
      .toBe("Privacy");
  });

  it("uses params.label to override the aria-label", () => {
    const { document } = render("feature-card", {
      heading: "Privacy",
      label: "About privacy",
    });
    expect(document.querySelector("article").getAttribute("aria-label"))
      .toBe("About privacy");
  });

  it("defaults data-image-position to 'start'", () => {
    const { document } = render("feature-card", { heading: "X" });
    expect(document.querySelector("article").getAttribute("data-image-position"))
      .toBe("start");
  });

  it("renders data-image-position when provided", () => {
    const { document } = render("feature-card", {
      heading: "X",
      imagePosition: "top",
    });
    expect(document.querySelector("article").getAttribute("data-image-position"))
      .toBe("top");
  });

  it("renders the image when imageUrl is provided", () => {
    const { document } = render("feature-card", {
      heading: "X",
      imageUrl: "/img/x.png",
      imageAlt: "Alt",
    });
    const img = document.querySelector("article img.feature-card-image");
    expect(img).toBeTruthy();
    expect(img.getAttribute("src")).toBe("/img/x.png");
    expect(img.getAttribute("alt")).toBe("Alt");
  });

  it("omits the image when imageUrl is missing", () => {
    const { document } = render("feature-card", { heading: "X" });
    expect(document.querySelector("article img")).toBeFalsy();
  });

  it("renders the description as a <p>", () => {
    const { document } = render("feature-card", {
      heading: "X",
      description: "Body text.",
    });
    expect(document.querySelector("article p.feature-card-description")
      .textContent).toBe("Body text.");
  });

  it("renders caller block content", () => {
    const { document } = render(
      "feature-card",
      { heading: "X" },
      "<a href='/x'>Learn</a>",
    );
    expect(document.querySelector("article a").textContent).toBe("Learn");
  });

  it("appends params.classes", () => {
    const { document } = render("feature-card", {
      heading: "X",
      classes: "large",
    });
    expect(document.querySelector("article.feature-card.large")).toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render("feature-card", {
      heading: "X",
      attributes: { "data-test": "x" },
    });
    expect(document.querySelector("article").getAttribute("data-test"))
      .toBe("x");
  });

  it("contains no <style> tag", () => {
    const { html } = render("feature-card", { heading: "X" });
    expect(html).not.toContain("<style");
  });
});
