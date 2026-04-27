import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("step-list", () => {
  it("renders an <ol> with the base class", () => {
    const { document } = render("step-list", {}, "<li>1</li>");
    const el = document.querySelector("ol.step-list");
    expect(el).toBeTruthy();
  });

  it("renders aria-label when provided", () => {
    const { document } = render(
      "step-list",
      { label: "Checkout" },
      "<li>1</li>",
    );
    expect(document.querySelector("ol.step-list").getAttribute("aria-label"))
      .toBe("Checkout");
  });

  it("omits aria-label when not provided", () => {
    const { document } = render("step-list", {}, "<li>1</li>");
    expect(document.querySelector("ol.step-list").hasAttribute("aria-label"))
      .toBe(false);
  });

  it("renders data-current when provided", () => {
    const { document } = render("step-list", { current: 1 }, "<li>1</li>");
    expect(document.querySelector("ol.step-list").getAttribute("data-current"))
      .toBe("1");
  });

  it("supports current = 0", () => {
    const { document } = render("step-list", { current: 0 }, "<li>1</li>");
    expect(document.querySelector("ol.step-list").getAttribute("data-current"))
      .toBe("0");
  });

  it("omits data-current when not provided", () => {
    const { document } = render("step-list", {}, "<li>1</li>");
    expect(document.querySelector("ol.step-list").hasAttribute("data-current"))
      .toBe(false);
  });

  it("renders caller content into the list", () => {
    const { document } = render(
      "step-list",
      {},
      "<li class='inner'>Step</li>",
    );
    expect(document.querySelector("ol.step-list li.inner")).toBeTruthy();
  });

  it("renders params.html as raw HTML", () => {
    const { document } = render("step-list", {
      html: "<li class='inner'>Step</li>",
    });
    expect(document.querySelector("ol.step-list li.inner")).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render(
      "step-list",
      { classes: "extra" },
      "<li>1</li>",
    );
    expect(document.querySelector("ol.step-list.extra")).toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render(
      "step-list",
      { attributes: { "data-test": "x" } },
      "<li>1</li>",
    );
    expect(document.querySelector("ol.step-list").getAttribute("data-test"))
      .toBe("x");
  });

  it("contains no <style> tag", () => {
    const { html } = render("step-list", {}, "<li>1</li>");
    expect(html).not.toContain("<style");
  });
});
