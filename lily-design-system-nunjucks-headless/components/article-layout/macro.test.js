import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("article-layout", () => {
  it("renders a <article> with the base class", () => {
    const { document } = render("article-layout", {}, "content");
    expect(document.querySelector("article.article-layout")).toBeTruthy();
  });

  it("does not set aria-label by default", () => {
    const { document } = render("article-layout", {}, "x");
    expect(document.querySelector(".article-layout").getAttribute("aria-label")).toBeNull();
  });

  it("renders the caller content", () => {
    const { document } = render("article-layout", {}, "<span>hello</span>");
    expect(document.querySelector(".article-layout span").textContent).toBe("hello");
  });
});
