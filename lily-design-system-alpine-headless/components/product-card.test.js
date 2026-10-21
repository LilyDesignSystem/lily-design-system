// product-card.test.js
// ProductCard component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("article.product-card");


describe("ProductCard", () => {
  it("renders the element with its base class", async () => {
    await mount("product-card");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("product-card")).toBe(true);
  });

  it("uses the article element", async () => {
    await mount("product-card");
    expect(el().tagName.toLowerCase()).toBe("article");
  });
});
