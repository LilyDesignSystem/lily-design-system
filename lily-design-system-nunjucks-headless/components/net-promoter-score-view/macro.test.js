import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("net-promoter-score-view", () => {
  const name = "net-promoter-score-view";

  it("renders a <span> with the base class", () => {
    const { document } = render(name, { value: 9 });
    expect(document.querySelector(`span.${name}`)).toBeTruthy();
  });

  it("categorises 9 and 10 as promoter", () => {
    const { document: a } = render(name, { value: 9 });
    expect(a.querySelector(`span.${name}`).getAttribute("data-category"))
      .toBe("promoter");
    const { document: b } = render(name, { value: 10 });
    expect(b.querySelector(`span.${name}`).getAttribute("data-category"))
      .toBe("promoter");
  });

  it("categorises 7 and 8 as passive", () => {
    const { document: a } = render(name, { value: 7 });
    expect(a.querySelector(`span.${name}`).getAttribute("data-category"))
      .toBe("passive");
    const { document: b } = render(name, { value: 8 });
    expect(b.querySelector(`span.${name}`).getAttribute("data-category"))
      .toBe("passive");
  });

  it("categorises 0–6 as detractor", () => {
    for (const v of [0, 3, 6]) {
      const { document } = render(name, { value: v });
      expect(document.querySelector(`span.${name}`).getAttribute("data-category"))
        .toBe("detractor");
    }
  });

  it("generates a descriptive aria-label", () => {
    const { document } = render(name, { value: 10 });
    expect(document.querySelector(`span.${name}`).getAttribute("aria-label"))
      .toBe("Net Promoter Score: 10 — Promoter");
  });

  it("renders the value and category in child spans", () => {
    const { document } = render(name, { value: 8 });
    expect(document.querySelector(".net-promoter-score-view-value").textContent)
      .toBe("8");
    expect(document.querySelector(".net-promoter-score-view-category").textContent.trim())
      .toBe("Passive");
  });

  it("appends params.classes", () => {
    const { document } = render(name, { value: 9, classes: "large" });
    expect(document.querySelector(`span.${name}.large`)).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render(name, { value: 9 });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
