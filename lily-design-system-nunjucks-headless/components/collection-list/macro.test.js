import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("collection-list", () => {
  it("renders a <ul> with the base class", () => {
    const { document } = render("collection-list", {});
    const el = document.querySelector("ul.collection-list");
    expect(el).toBeTruthy();
  });

  it("renders aria-label when provided", () => {
    const { document } = render("collection-list", { label: "Latest articles" });
    expect(document.querySelector("ul.collection-list").getAttribute("aria-label"))
      .toBe("Latest articles");
  });

  it("omits aria-label when not provided", () => {
    const { document } = render("collection-list", {});
    expect(document.querySelector("ul.collection-list").hasAttribute("aria-label"))
      .toBe(false);
  });

  it("renders aria-labelledby when provided", () => {
    const { document } = render("collection-list", { labelledBy: "h1" });
    expect(document.querySelector("ul.collection-list").getAttribute("aria-labelledby"))
      .toBe("h1");
  });

  it("renders caller block content", () => {
    const { document } = render(
      "collection-list",
      {},
      "<li>One</li><li>Two</li>",
    );
    expect(document.querySelectorAll("ul.collection-list li").length).toBe(2);
  });

  it("appends params.classes", () => {
    const { document } = render("collection-list", { classes: "compact" });
    expect(document.querySelector("ul.collection-list.compact")).toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render("collection-list", {
      attributes: { "data-test": "x" },
    });
    expect(document.querySelector("ul.collection-list").getAttribute("data-test"))
      .toBe("x");
  });

  it("contains no <style> tag", () => {
    const { html } = render("collection-list", {});
    expect(html).not.toContain("<style");
  });
});
