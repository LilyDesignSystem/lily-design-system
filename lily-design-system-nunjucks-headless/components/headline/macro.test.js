import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("headline", () => {
  it("renders a <div> with class headline", () => {
    const { document } = render("headline", {}, "Title");
    expect(document.querySelector("div.headline")).toBeTruthy();
  });

  it("renders h1 by default", () => {
    const { document } = render("headline", {}, "Title");
    const h = document.querySelector(".headline-heading");
    expect(h.tagName).toBe("H1");
    expect(h.textContent.trim()).toBe("Title");
  });

  it("respects the level param", () => {
    const { document } = render("headline", { level: 3 }, "Title");
    expect(document.querySelector(".headline-heading").tagName).toBe("H3");
  });

  it("renders subtitleText when provided", () => {
    const { document } = render("headline", { subtitleText: "The dek" }, "Title");
    expect(document.querySelector(".headline-subtitle").textContent.trim()).toBe("The dek");
  });

  it("renders bylineHtml when provided", () => {
    const { document } = render("headline", {
      bylineHtml: "<span>By Jane</span>",
    }, "Title");
    expect(document.querySelector(".headline-byline").textContent.trim()).toBe("By Jane");
  });
});
