import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("five-star-rating-view", () => {
  it("renders a <span role=img> with the base class", () => {
    const { document } = render("five-star-rating-view", { value: 4 });
    const el = document.querySelector("span.five-star-rating-view");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("img");
  });

  it("defaults max to 5 and emits data-value + data-max", () => {
    const { document } = render("five-star-rating-view", { value: 4 });
    const el = document.querySelector("span.five-star-rating-view");
    expect(el.getAttribute("data-value")).toBe("4");
    expect(el.getAttribute("data-max")).toBe("5");
  });

  it("respects a custom max", () => {
    const { document } = render("five-star-rating-view", {
      value: 7,
      max: 10,
    });
    const el = document.querySelector("span.five-star-rating-view");
    expect(el.getAttribute("data-max")).toBe("10");
  });

  it("generates a default aria-label", () => {
    const { document } = render("five-star-rating-view", { value: 4 });
    expect(document.querySelector("span.five-star-rating-view").getAttribute("aria-label"))
      .toBe("Rating: 4 out of 5 stars");
  });

  it("respects a custom label", () => {
    const { document } = render("five-star-rating-view", {
      value: 4,
      label: "Service rating: 4 out of 5",
    });
    expect(document.querySelector("span.five-star-rating-view").getAttribute("aria-label"))
      .toBe("Service rating: 4 out of 5");
  });

  it("appends params.classes", () => {
    const { document } = render("five-star-rating-view", {
      value: 4,
      classes: "large",
    });
    expect(document.querySelector("span.five-star-rating-view.large")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("five-star-rating-view", { value: 4 });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
