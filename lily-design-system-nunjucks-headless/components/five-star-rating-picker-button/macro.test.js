import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("five-star-rating-picker-button", () => {
  it("renders a <button role=radio> with the base class", () => {
    const { document } = render("five-star-rating-picker-button", {
      value: 3,
    });
    const el = document.querySelector("button.five-star-rating-picker-button");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("radio");
  });

  it("sets data-value", () => {
    const { document } = render("five-star-rating-picker-button", {
      value: 5,
    });
    expect(
      document.querySelector("button.five-star-rating-picker-button").getAttribute("data-value"),
    ).toBe("5");
  });

  it("generates default aria-label (plural)", () => {
    const { document } = render("five-star-rating-picker-button", {
      value: 4,
    });
    expect(
      document.querySelector("button.five-star-rating-picker-button").getAttribute("aria-label"),
    ).toBe("Rate 4 stars");
  });

  it("generates singular aria-label for value=1", () => {
    const { document } = render("five-star-rating-picker-button", {
      value: 1,
    });
    expect(
      document.querySelector("button.five-star-rating-picker-button").getAttribute("aria-label"),
    ).toBe("Rate 1 star");
  });

  it("sets aria-checked and tabindex based on checked", () => {
    const { document } = render("five-star-rating-picker-button", {
      value: 3,
      checked: true,
    });
    const el = document.querySelector("button.five-star-rating-picker-button");
    expect(el.getAttribute("aria-checked")).toBe("true");
    expect(el.getAttribute("tabindex")).toBe("0");
  });

  it("supports disabled", () => {
    const { document } = render("five-star-rating-picker-button", {
      value: 3,
      disabled: true,
    });
    expect(
      document.querySelector("button.five-star-rating-picker-button").hasAttribute("disabled"),
    ).toBe(true);
  });

  it("appends params.classes", () => {
    const { document } = render("five-star-rating-picker-button", {
      value: 3,
      classes: "large",
    });
    expect(document.querySelector("button.five-star-rating-picker-button.large"))
      .toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("five-star-rating-picker-button", { value: 3 });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
