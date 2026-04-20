import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("five-face-rating-picker", () => {
  const name = "five-face-rating-picker";

  it("renders a <div role=radiogroup> with the base class", () => {
    const { document } = render(name, {});
    const el = document.querySelector(`div.${name}`);
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("radiogroup");
  });

  it("defaults aria-label to 'Satisfaction rating'", () => {
    const { document } = render(name, {});
    expect(document.querySelector(`div.${name}`).getAttribute("aria-label"))
      .toBe("Satisfaction rating");
  });

  it("respects a custom label", () => {
    const { document } = render(name, {
      label: "How satisfied were you?",
    });
    expect(document.querySelector(`div.${name}`).getAttribute("aria-label"))
      .toBe("How satisfied were you?");
  });

  it("renders caller block content", () => {
    const { document } = render(
      name,
      {},
      '<button class="five-face-rating-picker-button"></button>',
    );
    expect(
      document.querySelector(`div.${name} .five-face-rating-picker-button`),
    ).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render(name, { classes: "large" });
    expect(document.querySelector(`div.${name}.large`)).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render(name, {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
