import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("five-face-rating-picker-button", () => {
  const name = "five-face-rating-picker-button";

  it("renders a <button role=radio> with the base class", () => {
    const { document } = render(name, { value: 3 });
    const el = document.querySelector(`button.${name}`);
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("radio");
  });

  it("sets data-value from params.value", () => {
    const { document } = render(name, { value: 5 });
    expect(document.querySelector(`button.${name}`).getAttribute("data-value"))
      .toBe("5");
  });

  it("generates default aria-label from value", () => {
    const cases = [
      [1, "Very unhappy"],
      [2, "Unhappy"],
      [3, "Neutral"],
      [4, "Happy"],
      [5, "Very happy"],
    ];
    for (const [value, phrase] of cases) {
      const { document } = render(name, { value });
      expect(document.querySelector(`button.${name}`).getAttribute("aria-label"))
        .toBe(phrase);
    }
  });

  it("sets aria-checked and tabindex from checked", () => {
    const { document } = render(name, { value: 3, checked: true });
    const el = document.querySelector(`button.${name}`);
    expect(el.getAttribute("aria-checked")).toBe("true");
    expect(el.getAttribute("tabindex")).toBe("0");
  });

  it("supports disabled", () => {
    const { document } = render(name, { value: 3, disabled: true });
    expect(document.querySelector(`button.${name}`).hasAttribute("disabled"))
      .toBe(true);
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render(name, { value: 3 });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
