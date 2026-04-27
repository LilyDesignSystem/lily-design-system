import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("government-identifier", () => {
  const baseParams = {
    label: "Agency identifier",
    agencyName: "U.S. General Services Administration",
  };

  it("renders a <section> with the base class and aria-label", () => {
    const { document } = render("government-identifier", baseParams);
    const el = document.querySelector("section.government-identifier");
    expect(el).toBeTruthy();
    expect(el.getAttribute("aria-label")).toBe("Agency identifier");
  });

  it("renders the agency name", () => {
    const { document } = render("government-identifier", baseParams);
    const p = document.querySelector(".government-identifier-agency");
    expect(p.textContent).toContain("General Services");
  });

  it("renders agency name as a span when no href", () => {
    const { document } = render("government-identifier", baseParams);
    expect(document.querySelector(".government-identifier-agency span")).toBeTruthy();
    expect(document.querySelector(".government-identifier-agency a")).toBeNull();
  });

  it("wraps agency name in <a> when agencyHref is provided", () => {
    const { document } = render("government-identifier", {
      ...baseParams,
      agencyHref: "https://www.gsa.gov",
    });
    const a = document.querySelector(".government-identifier-agency a");
    expect(a).toBeTruthy();
    expect(a.getAttribute("href")).toBe("https://www.gsa.gov");
  });

  it("renders the logo image when logoUrl is provided", () => {
    const { document } = render("government-identifier", {
      ...baseParams,
      logoUrl: "/logo.svg",
      logoAlt: "GSA logo",
    });
    const img = document.querySelector("img.government-identifier-logo");
    expect(img).toBeTruthy();
    expect(img.getAttribute("src")).toBe("/logo.svg");
    expect(img.getAttribute("alt")).toBe("GSA logo");
  });

  it("renders the description when provided", () => {
    const { document } = render("government-identifier", {
      ...baseParams,
      description: "An independent agency",
    });
    expect(document.querySelector(".government-identifier-description").textContent)
      .toBe("An independent agency");
  });

  it("renders a nav landmark with aria-label", () => {
    const { document } = render("government-identifier", baseParams);
    const nav = document.querySelector("nav.government-identifier-links");
    expect(nav).toBeTruthy();
    expect(nav.getAttribute("aria-label")).toBe("Agency identifier");
  });

  it("renders caller block content into the nav", () => {
    const { document } = render(
      "government-identifier",
      baseParams,
      "<ul><li><a href='/about'>About</a></li></ul>",
    );
    expect(document.querySelector("nav.government-identifier-links a")
      .getAttribute("href")).toBe("/about");
  });

  it("appends params.classes", () => {
    const { document } = render("government-identifier", {
      ...baseParams,
      classes: "compact",
    });
    expect(document.querySelector("section.government-identifier.compact")).toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render("government-identifier", {
      ...baseParams,
      attributes: { "data-test": "x" },
    });
    expect(document.querySelector("section.government-identifier")
      .getAttribute("data-test")).toBe("x");
  });

  it("contains no <style> tag", () => {
    const { html } = render("government-identifier", baseParams);
    expect(html).not.toContain("<style");
  });
});
