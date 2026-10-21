// article-layout.test.js
// ArticleLayout component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("article.article-layout");


describe("ArticleLayout", () => {
  it("renders the element with its base class", async () => {
    await mount("article-layout");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("article-layout")).toBe(true);
  });

  it("uses the article element", async () => {
    await mount("article-layout");
    expect(el().tagName.toLowerCase()).toBe("article");
  });
});
