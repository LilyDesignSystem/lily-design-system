import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("vital-sign-sleep-score-as-0-to-100-view", () => {
  const name = "vital-sign-sleep-score-as-0-to-100-view";

  it("renders a <span> with the base class", () => {
    const { document } = render(name, { value: 82 });
    expect(document.querySelector(`span.${name}`)).toBeTruthy();
  });

  it("wraps value + '/ 100' suffix", () => {
    const { document } = render(name, { value: 82 });
    expect(document.querySelector(".vital-sign-value").textContent).toBe("82");
    const unit = document.querySelector(".vital-sign-unit");
    expect(unit).toBeTruthy();
    expect(unit.textContent.replace(/\s+/g, "")).toBe("/100");
  });

  it("sets aria-label from params.label", () => {
    const { document } = render(name, { value: 82, label: "Sleep score" });
    expect(document.querySelector(`span.${name}`).getAttribute("aria-label"))
      .toBe("Sleep score");
  });

  it("appends params.classes", () => {
    const { document } = render(name, { value: 45, classes: "poor" });
    expect(document.querySelector(`span.${name}.poor`)).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render(name, { value: 82 });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
