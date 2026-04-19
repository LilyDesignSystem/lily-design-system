import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("hero", () => {
  it("renders a <section> with the base class", () => {
    const { document } = render("hero", { heading: "Welcome" });
    expect(document.querySelector("section.hero")).toBeTruthy();
  });

  it("renders heading at level 1 by default and links via aria-labelledby", () => {
    const { document } = render("hero", {
      heading: "Welcome",
      id: "h",
    });
    const sec = document.querySelector("section.hero");
    expect(sec.getAttribute("aria-labelledby")).toBe("h-heading");
    const h = document.querySelector("section.hero h1.hero-heading");
    expect(h).toBeTruthy();
    expect(h.getAttribute("id")).toBe("h-heading");
    expect(h.textContent).toBe("Welcome");
  });

  it("respects a custom heading level", () => {
    const { document } = render("hero", {
      heading: "Welcome",
      headingLevel: 2,
    });
    expect(document.querySelector("section.hero h2.hero-heading")).toBeTruthy();
  });

  it("renders description as <p>", () => {
    const { document } = render("hero", {
      heading: "x",
      description: "Find services near you.",
    });
    const p = document.querySelector("section.hero p.hero-description");
    expect(p).toBeTruthy();
    expect(p.textContent.trim()).toBe("Find services near you.");
  });

  it("renders descriptionHtml raw", () => {
    const { document } = render("hero", {
      heading: "x",
      descriptionHtml: "<strong>New</strong> service.",
    });
    expect(
      document.querySelector("section.hero .hero-description strong"),
    ).toBeTruthy();
  });

  it("renders caller block content inside .hero-extras", () => {
    const { document } = render(
      "hero",
      { heading: "x" },
      '<a href="/" class="action-link">Start now</a>',
    );
    expect(
      document.querySelector("section.hero .hero-extras a.action-link"),
    ).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("hero", {
      heading: "x",
      classes: "hero-feature",
    });
    expect(document.querySelector("section.hero.hero-feature")).toBeTruthy();
  });

  it("falls back to aria-label when no heading is given", () => {
    const { document } = render("hero", {
      label: "Hero",
      description: "x",
    });
    expect(document.querySelector("section.hero").getAttribute("aria-label"))
      .toBe("Hero");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("hero", { heading: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
