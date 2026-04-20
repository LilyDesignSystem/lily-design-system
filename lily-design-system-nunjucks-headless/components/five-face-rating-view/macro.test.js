import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("five-face-rating-view", () => {
  const name = "five-face-rating-view";

  it("renders a <span role=img> with the base class", () => {
    const { document } = render(name, { value: 4 });
    const el = document.querySelector(`span.${name}`);
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("img");
  });

  it("sets data-value from params.value", () => {
    const { document } = render(name, { value: 5 });
    expect(document.querySelector(`span.${name}`).getAttribute("data-value"))
      .toBe("5");
  });

  it("generates descriptive aria-label from value", () => {
    const cases = [
      [1, "Very unhappy"],
      [2, "Unhappy"],
      [3, "Neutral"],
      [4, "Happy"],
      [5, "Very happy"],
    ];
    for (const [value, phrase] of cases) {
      const { document } = render(name, { value });
      expect(document.querySelector(`span.${name}`).getAttribute("aria-label"))
        .toBe(`Rating: ${phrase}`);
    }
  });

  it("respects a custom label", () => {
    const { document } = render(name, { value: 4, label: "Very happy!" });
    expect(document.querySelector(`span.${name}`).getAttribute("aria-label"))
      .toBe("Very happy!");
  });

  it("appends params.classes", () => {
    const { document } = render(name, { value: 4, classes: "large" });
    expect(document.querySelector(`span.${name}.large`)).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render(name, { value: 4 });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
