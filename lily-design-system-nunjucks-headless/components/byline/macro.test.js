import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("byline", () => {
  it("renders a <div> with class byline", () => {
    const { document } = render("byline", {}, "Jane");
    expect(document.querySelector("div.byline")).toBeTruthy();
  });

  it("renders the authors caller content", () => {
    const { document } = render("byline", {}, "Jane Smith");
    expect(document.querySelector(".byline-authors").textContent.trim()).toBe("Jane Smith");
  });

  it("renders publishedHtml when provided", () => {
    const { document } = render("byline", {
      publishedHtml: '<time datetime="2026-04-15">April 15, 2026</time>',
    }, "Jane");
    const t = document.querySelector(".byline-published time");
    expect(t.getAttribute("datetime")).toBe("2026-04-15");
    expect(t.textContent).toBe("April 15, 2026");
  });

  it("renders updatedHtml when provided", () => {
    const { document } = render("byline", {
      updatedHtml: '<time datetime="2026-04-16">April 16</time>',
    }, "Jane");
    expect(document.querySelector(".byline-updated time").getAttribute("datetime")).toBe("2026-04-16");
  });

  it("omits published/updated when not provided", () => {
    const { document } = render("byline", {}, "Jane");
    expect(document.querySelector(".byline-published")).toBeNull();
    expect(document.querySelector(".byline-updated")).toBeNull();
  });
});
