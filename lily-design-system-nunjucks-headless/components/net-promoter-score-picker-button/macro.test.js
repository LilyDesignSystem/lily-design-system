import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("net-promoter-score-picker-button", () => {
  const name = "net-promoter-score-picker-button";

  it("renders a <button role=radio> with the base class", () => {
    const { document } = render(name, { value: 7 });
    const el = document.querySelector(`button.${name}`);
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("radio");
  });

  it("renders data-value and data-category", () => {
    const { document } = render(name, { value: 9 });
    const el = document.querySelector(`button.${name}`);
    expect(el.getAttribute("data-value")).toBe("9");
    expect(el.getAttribute("data-category")).toBe("promoter");
  });

  it("generates default aria-label 'Rate N out of 10'", () => {
    const { document } = render(name, { value: 7 });
    expect(document.querySelector(`button.${name}`).getAttribute("aria-label"))
      .toBe("Rate 7 out of 10");
  });

  it("sets aria-checked and tabindex from checked", () => {
    const { document } = render(name, { value: 9, checked: true });
    const el = document.querySelector(`button.${name}`);
    expect(el.getAttribute("aria-checked")).toBe("true");
    expect(el.getAttribute("tabindex")).toBe("0");
  });

  it("renders the visible score", () => {
    const { document } = render(name, { value: 9 });
    expect(document.querySelector(`button.${name}`).textContent.trim()).toBe("9");
  });

  it("supports disabled", () => {
    const { document } = render(name, { value: 7, disabled: true });
    expect(document.querySelector(`button.${name}`).hasAttribute("disabled"))
      .toBe(true);
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render(name, { value: 7 });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
