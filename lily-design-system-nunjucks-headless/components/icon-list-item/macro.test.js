import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("icon-list-item", () => {
  it("renders an <li> with the base class", () => {
    const { document } = render("icon-list-item", { text: "Fast" });
    expect(document.querySelector("li.icon-list-item")).toBeTruthy();
  });

  it("renders text content inside the text span", () => {
    const { document } = render("icon-list-item", { text: "Fast" });
    expect(document.querySelector("li.icon-list-item .icon-list-item-text").textContent.trim())
      .toBe("Fast");
  });

  it("renders the icon span with aria-hidden when iconHtml is provided", () => {
    const { document } = render("icon-list-item", {
      text: "Fast",
      iconHtml: "<svg></svg>",
    });
    const icon = document.querySelector(".icon-list-item-icon");
    expect(icon).toBeTruthy();
    expect(icon.getAttribute("aria-hidden")).toBe("true");
    expect(icon.querySelector("svg")).toBeTruthy();
  });

  it("omits the icon span when iconHtml is not provided", () => {
    const { document } = render("icon-list-item", { text: "Fast" });
    expect(document.querySelector(".icon-list-item-icon")).toBeNull();
  });

  it("renders raw html via params.html", () => {
    const { document } = render("icon-list-item", { html: "<strong>Hi</strong>" });
    expect(document.querySelector("li.icon-list-item .icon-list-item-text strong"))
      .toBeTruthy();
  });

  it("renders caller block content", () => {
    const { document } = render(
      "icon-list-item",
      {},
      "<em>caller</em>",
    );
    expect(document.querySelector("li.icon-list-item .icon-list-item-text em").textContent)
      .toBe("caller");
  });

  it("appends params.classes", () => {
    const { document } = render("icon-list-item", {
      text: "Fast",
      classes: "highlight",
    });
    expect(document.querySelector("li.icon-list-item.highlight")).toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render("icon-list-item", {
      text: "Fast",
      attributes: { "data-test": "x" },
    });
    expect(document.querySelector("li.icon-list-item").getAttribute("data-test"))
      .toBe("x");
  });

  it("contains no <style> tag", () => {
    const { html } = render("icon-list-item", { text: "Fast" });
    expect(html).not.toContain("<style");
  });
});
