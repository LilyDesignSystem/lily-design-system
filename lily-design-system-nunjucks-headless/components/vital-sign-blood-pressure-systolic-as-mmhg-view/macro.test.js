import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("vital-sign-blood-pressure-systolic-as-mmhg-view", () => {
  it("renders a <span> with the base class", () => {
    const { document } = render(
      "vital-sign-blood-pressure-systolic-as-mmhg-view",
      { value: 118 },
    );
    expect(document.querySelector(
      "span.vital-sign-blood-pressure-systolic-as-mmhg-view",
    )).toBeTruthy();
  });

  it("wraps the value in a .vital-sign-value child", () => {
    const { document } = render(
      "vital-sign-blood-pressure-systolic-as-mmhg-view",
      { value: 118 },
    );
    expect(document.querySelector(".vital-sign-value").textContent).toBe("118");
  });

  it("renders the unit in an <abbr> with 'millimetres of mercury' title", () => {
    const { document } = render(
      "vital-sign-blood-pressure-systolic-as-mmhg-view",
      { value: 118 },
    );
    const abbr = document.querySelector("abbr.vital-sign-unit");
    expect(abbr).toBeTruthy();
    expect(abbr.getAttribute("title")).toBe("millimetres of mercury");
    expect(abbr.textContent).toBe("mmHg");
  });

  it("sets aria-label from params.label", () => {
    const { document } = render(
      "vital-sign-blood-pressure-systolic-as-mmhg-view",
      { value: 118, label: "Systolic BP" },
    );
    expect(document.querySelector("span.vital-sign-blood-pressure-systolic-as-mmhg-view")
      .getAttribute("aria-label")).toBe("Systolic BP");
  });

  it("appends params.classes", () => {
    const { document } = render(
      "vital-sign-blood-pressure-systolic-as-mmhg-view",
      { value: 145, classes: "elevated" },
    );
    expect(document.querySelector(
      "span.vital-sign-blood-pressure-systolic-as-mmhg-view.elevated",
    )).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render(
      "vital-sign-blood-pressure-systolic-as-mmhg-view",
      { value: 118 },
    );
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
