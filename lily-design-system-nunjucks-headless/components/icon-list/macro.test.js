import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("icon-list", () => {
  it("renders a <ul> with the base class", () => {
    const { document } = render("icon-list", {});
    expect(document.querySelector("ul.icon-list")).toBeTruthy();
  });

  it("renders aria-label when provided", () => {
    const { document } = render("icon-list", { label: "Benefits" });
    expect(document.querySelector("ul.icon-list").getAttribute("aria-label"))
      .toBe("Benefits");
  });

  it("omits aria-label when not provided", () => {
    const { document } = render("icon-list", {});
    expect(document.querySelector("ul.icon-list").hasAttribute("aria-label"))
      .toBe(false);
  });

  it("renders aria-labelledby when provided", () => {
    const { document } = render("icon-list", { labelledBy: "h2" });
    expect(document.querySelector("ul.icon-list").getAttribute("aria-labelledby"))
      .toBe("h2");
  });

  it("renders caller block content", () => {
    const { document } = render("icon-list", {}, "<li>One</li><li>Two</li>");
    expect(document.querySelectorAll("ul.icon-list li").length).toBe(2);
  });

  it("appends params.classes", () => {
    const { document } = render("icon-list", { classes: "compact" });
    expect(document.querySelector("ul.icon-list.compact")).toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render("icon-list", {
      attributes: { "data-test": "x" },
    });
    expect(document.querySelector("ul.icon-list").getAttribute("data-test"))
      .toBe("x");
  });

  it("contains no <style> tag", () => {
    const { html } = render("icon-list", {});
    expect(html).not.toContain("<style");
  });
});
