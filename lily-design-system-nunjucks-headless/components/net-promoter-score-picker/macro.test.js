import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("net-promoter-score-picker", () => {
  const name = "net-promoter-score-picker";

  it("renders a <div role=radiogroup> with the base class", () => {
    const { document } = render(name, {});
    const el = document.querySelector(`div.${name}`);
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("radiogroup");
  });

  it("defaults aria-label to 'Net Promoter Score'", () => {
    const { document } = render(name, {});
    expect(document.querySelector(`div.${name}`).getAttribute("aria-label"))
      .toBe("Net Promoter Score");
  });

  it("respects a custom label", () => {
    const { document } = render(name, {
      label: "How likely are you to recommend us?",
    });
    expect(document.querySelector(`div.${name}`).getAttribute("aria-label"))
      .toBe("How likely are you to recommend us?");
  });

  it("renders caller block content", () => {
    const { document } = render(
      name,
      {},
      '<button class="net-promoter-score-picker-button">0</button>',
    );
    expect(
      document.querySelector(`div.${name} .net-promoter-score-picker-button`),
    ).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render(name, { classes: "inline" });
    expect(document.querySelector(`div.${name}.inline`)).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render(name, {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
