import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("vital-sign-body-fat-as-percentage-view", () => {
  const name = "vital-sign-body-fat-as-percentage-view";

  it("renders a <span> with the base class", () => {
    const { document } = render(name, { value: "22.5" });
    expect(document.querySelector(`span.${name}`)).toBeTruthy();
  });

  it("wraps value + '%' unit", () => {
    const { document } = render(name, { value: "22.5" });
    expect(document.querySelector(".vital-sign-value").textContent).toBe("22.5");
    const unit = document.querySelector(".vital-sign-unit");
    expect(unit).toBeTruthy();
    expect(unit.textContent).toBe("%");
  });

  it("sets aria-label from params.label", () => {
    const { document } = render(name, { value: "22.5", label: "Body fat" });
    expect(document.querySelector(`span.${name}`).getAttribute("aria-label"))
      .toBe("Body fat");
  });

  it("appends params.classes", () => {
    const { document } = render(name, { value: "32.1", classes: "elevated" });
    expect(document.querySelector(`span.${name}.elevated`)).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render(name, { value: "22.5" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
