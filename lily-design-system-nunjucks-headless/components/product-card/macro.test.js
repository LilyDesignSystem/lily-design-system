import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("product-card", () => {
  it("renders an <article> with the base class", () => {
    const { document } = render("product-card", {
      name: "Headphones",
      price: "$199.00",
    });
    const el = document.querySelector("article.product-card");
    expect(el).toBeTruthy();
  });

  it("uses name as aria-label by default", () => {
    const { document } = render("product-card", {
      name: "Headphones",
      price: "$199.00",
    });
    expect(
      document.querySelector("article.product-card").getAttribute("aria-label"),
    ).toBe("Headphones");
  });

  it("respects a custom aria-label via params.label", () => {
    const { document } = render("product-card", {
      name: "Headphones",
      price: "$199.00",
      label: "Premium headphones",
    });
    expect(
      document.querySelector("article.product-card").getAttribute("aria-label"),
    ).toBe("Premium headphones");
  });

  it("renders the name inside an <h3 class='product-card-name'>", () => {
    const { document } = render("product-card", {
      name: "Headphones",
      price: "$199.00",
    });
    const h3 = document.querySelector("h3.product-card-name");
    expect(h3).toBeTruthy();
    expect(h3.textContent).toBe("Headphones");
  });

  it("renders the price inside a <p class='product-card-price'>", () => {
    const { document } = render("product-card", {
      name: "Headphones",
      price: "$199.00",
    });
    const p = document.querySelector("p.product-card-price");
    expect(p).toBeTruthy();
    expect(p.textContent).toBe("$199.00");
  });

  it("renders an <img class='product-card-image'> when imageUrl is provided", () => {
    const { document } = render("product-card", {
      name: "Headphones",
      price: "$199.00",
      imageUrl: "/img.jpg",
      imageAlt: "Headphones in black",
    });
    const img = document.querySelector("img.product-card-image");
    expect(img).toBeTruthy();
    expect(img.getAttribute("src")).toBe("/img.jpg");
    expect(img.getAttribute("alt")).toBe("Headphones in black");
  });

  it("uses empty alt when imageAlt is not provided", () => {
    const { document } = render("product-card", {
      name: "Headphones",
      price: "$199.00",
      imageUrl: "/img.jpg",
    });
    expect(document.querySelector("img.product-card-image").getAttribute("alt"))
      .toBe("");
  });

  it("omits the <img> when imageUrl is missing", () => {
    const { document } = render("product-card", {
      name: "Headphones",
      price: "$199.00",
    });
    expect(document.querySelector("img.product-card-image")).toBeFalsy();
  });

  it("renders caller block content after the header", () => {
    const { document } = render(
      "product-card",
      { name: "Headphones", price: "$199.00" },
      '<button class="cart">Buy</button>',
    );
    expect(document.querySelector("article.product-card .cart")).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("product-card", {
      name: "x",
      price: "$0",
      classes: "featured",
    });
    expect(document.querySelector("article.product-card.featured")).toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render("product-card", {
      name: "x",
      price: "$0",
      attributes: { "data-test": "v" },
    });
    expect(
      document.querySelector("article.product-card").getAttribute("data-test"),
    ).toBe("v");
  });

  it("contains no <style> tag", () => {
    const { html } = render("product-card", {
      name: "x",
      price: "$0",
    });
    expect(html).not.toContain("<style");
  });
});
