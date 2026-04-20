import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("five-star-rating-picker", () => {
  it("renders a <div role=radiogroup> with the base class", () => {
    const { document } = render("five-star-rating-picker", {});
    const el = document.querySelector("div.five-star-rating-picker");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("radiogroup");
  });

  it("defaults aria-label to 'Rate out of 5'", () => {
    const { document } = render("five-star-rating-picker", {});
    expect(document.querySelector("div.five-star-rating-picker").getAttribute("aria-label"))
      .toBe("Rate out of 5");
  });

  it("respects a custom label", () => {
    const { document } = render("five-star-rating-picker", {
      label: "How satisfied are you?",
    });
    expect(document.querySelector("div.five-star-rating-picker").getAttribute("aria-label"))
      .toBe("How satisfied are you?");
  });

  it("uses aria-labelledby when provided", () => {
    const { document } = render("five-star-rating-picker", {
      labelledBy: "q1",
    });
    const el = document.querySelector("div.five-star-rating-picker");
    expect(el.getAttribute("aria-labelledby")).toBe("q1");
    expect(el.hasAttribute("aria-label")).toBe(false);
  });

  it("renders caller block content", () => {
    const { document } = render(
      "five-star-rating-picker",
      {},
      '<button class="five-star-rating-picker-button"></button>',
    );
    expect(
      document.querySelector("div.five-star-rating-picker .five-star-rating-picker-button"),
    ).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("five-star-rating-picker", { classes: "large" });
    expect(document.querySelector("div.five-star-rating-picker.large")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("five-star-rating-picker", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
