import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("pictogram", () => {
  it("renders a <figure> with the base class", () => {
    const { document } = render("pictogram", { iconText: "X" });
    expect(document.querySelector("figure.pictogram")).toBeTruthy();
  });

  it("defaults data-layout to 'centered'", () => {
    const { document } = render("pictogram", { iconText: "X" });
    expect(document.querySelector("figure").getAttribute("data-layout"))
      .toBe("centered");
  });

  it("renders data-layout when provided", () => {
    const { document } = render("pictogram", {
      iconText: "X",
      layout: "side",
    });
    expect(document.querySelector("figure").getAttribute("data-layout"))
      .toBe("side");
  });

  it("renders the icon container with aria-hidden", () => {
    const { document } = render("pictogram", { iconText: "X" });
    const icon = document.querySelector("figure .pictogram-icon");
    expect(icon).toBeTruthy();
    expect(icon.getAttribute("aria-hidden")).toBe("true");
  });

  it("renders iconText inside the icon container", () => {
    const { document } = render("pictogram", { iconText: "🔒" });
    expect(document.querySelector(".pictogram-icon").textContent.trim())
      .toBe("🔒");
  });

  it("renders iconHtml as raw HTML inside the icon container", () => {
    const { document } = render("pictogram", {
      iconHtml: "<svg><title>lock</title></svg>",
    });
    expect(document.querySelector(".pictogram-icon svg")).toBeTruthy();
  });

  it("renders the heading inside an <h3>", () => {
    const { document } = render("pictogram", {
      iconText: "X",
      heading: "Privacy",
    });
    expect(document.querySelector("figure h3.pictogram-heading").textContent)
      .toBe("Privacy");
  });

  it("uses heading as the default aria-label", () => {
    const { document } = render("pictogram", {
      iconText: "X",
      heading: "Privacy",
    });
    expect(document.querySelector("figure").getAttribute("aria-label"))
      .toBe("Privacy");
  });

  it("uses params.label to override aria-label", () => {
    const { document } = render("pictogram", {
      iconText: "X",
      heading: "Privacy",
      label: "About privacy",
    });
    expect(document.querySelector("figure").getAttribute("aria-label"))
      .toBe("About privacy");
  });

  it("renders the description as a <p>", () => {
    const { document } = render("pictogram", {
      iconText: "X",
      heading: "Privacy",
      description: "Your data.",
    });
    expect(document.querySelector("p.pictogram-description").textContent)
      .toBe("Your data.");
  });

  it("renders caller block content overriding description", () => {
    const { document } = render(
      "pictogram",
      { iconText: "X", description: "Default", heading: "X" },
      "<a href='/'>Custom</a>",
    );
    expect(document.querySelector("figcaption a").textContent)
      .toBe("Custom");
    expect(document.querySelector(".pictogram-description")).toBeFalsy();
  });

  it("appends params.classes", () => {
    const { document } = render("pictogram", {
      iconText: "X",
      classes: "compact",
    });
    expect(document.querySelector("figure.pictogram.compact")).toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render("pictogram", {
      iconText: "X",
      attributes: { "data-test": "x" },
    });
    expect(document.querySelector("figure").getAttribute("data-test"))
      .toBe("x");
  });

  it("contains no <style> tag", () => {
    const { html } = render("pictogram", { iconText: "X" });
    expect(html).not.toContain("<style");
  });
});
