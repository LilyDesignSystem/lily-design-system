import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("sticky-promo-banner", () => {
  it("renders an <aside> with the base class", () => {
    const { document } = render("sticky-promo-banner", {
      label: "Promotion",
      text: "Hi",
    });
    expect(document.querySelector("aside.sticky-promo-banner")).toBeTruthy();
  });

  it("has role='complementary'", () => {
    const { document } = render("sticky-promo-banner", {
      label: "Promotion",
    });
    expect(document.querySelector("aside").getAttribute("role"))
      .toBe("complementary");
  });

  it("renders aria-label", () => {
    const { document } = render("sticky-promo-banner", {
      label: "Promotion",
    });
    expect(document.querySelector("aside").getAttribute("aria-label"))
      .toBe("Promotion");
  });

  it("defaults data-position to 'bottom' and uses bottom: 0 inline style", () => {
    const { document } = render("sticky-promo-banner", {
      label: "Promotion",
    });
    const aside = document.querySelector("aside");
    expect(aside.getAttribute("data-position")).toBe("bottom");
    expect(aside.getAttribute("style")).toContain("position: fixed");
    expect(aside.getAttribute("style")).toContain("bottom: 0");
  });

  it("renders top: 0 inline style when position is 'top'", () => {
    const { document } = render("sticky-promo-banner", {
      label: "Promotion",
      position: "top",
    });
    const aside = document.querySelector("aside");
    expect(aside.getAttribute("data-position")).toBe("top");
    expect(aside.getAttribute("style")).toContain("top: 0");
    expect(aside.getAttribute("style")).not.toContain("bottom: 0");
  });

  it("renders content inside .sticky-promo-banner-content", () => {
    const { document } = render(
      "sticky-promo-banner",
      { label: "Promotion" },
      "<p>Hi</p>",
    );
    expect(document.querySelector(".sticky-promo-banner-content p")
      .textContent).toBe("Hi");
  });

  it("renders the dismiss button only when dismissLabel is provided", () => {
    const { document } = render("sticky-promo-banner", {
      label: "Promotion",
      dismissLabel: "Dismiss",
    });
    const btn = document.querySelector("button.sticky-promo-banner-dismiss");
    expect(btn).toBeTruthy();
    expect(btn.getAttribute("type")).toBe("button");
    expect(btn.getAttribute("aria-label")).toBe("Dismiss");
  });

  it("omits the dismiss button when dismissLabel is missing", () => {
    const { document } = render("sticky-promo-banner", {
      label: "Promotion",
    });
    expect(document.querySelector("button.sticky-promo-banner-dismiss"))
      .toBeFalsy();
  });

  it("is visible by default (no hidden attribute)", () => {
    const { document } = render("sticky-promo-banner", {
      label: "Promotion",
    });
    expect(document.querySelector("aside").hasAttribute("hidden")).toBe(false);
  });

  it("renders hidden attribute when open is false", () => {
    const { document } = render("sticky-promo-banner", {
      label: "Promotion",
      open: false,
    });
    expect(document.querySelector("aside").hasAttribute("hidden")).toBe(true);
  });

  it("appends params.classes", () => {
    const { document } = render("sticky-promo-banner", {
      label: "Promotion",
      classes: "compact",
    });
    expect(document.querySelector("aside.sticky-promo-banner.compact"))
      .toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render("sticky-promo-banner", {
      label: "Promotion",
      attributes: { "data-test": "x" },
    });
    expect(document.querySelector("aside").getAttribute("data-test"))
      .toBe("x");
  });

  it("contains no <style> tag", () => {
    const { html } = render("sticky-promo-banner", { label: "Promotion" });
    expect(html).not.toContain("<style");
  });
});
