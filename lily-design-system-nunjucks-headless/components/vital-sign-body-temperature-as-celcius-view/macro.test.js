import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("vital-sign-body-temperature-as-celcius-view", () => {
  it("renders a <span> with the base class", () => {
    const { document } = render(
      "vital-sign-body-temperature-as-celcius-view",
      { value: "37.0" },
    );
    expect(document.querySelector(
      "span.vital-sign-body-temperature-as-celcius-view",
    )).toBeTruthy();
  });

  it("wraps the value in a .vital-sign-value child", () => {
    const { document } = render(
      "vital-sign-body-temperature-as-celcius-view",
      { value: "37.0" },
    );
    expect(document.querySelector(".vital-sign-value").textContent)
      .toBe("37.0");
  });

  it("renders the unit in an <abbr> with 'degrees Celsius' title", () => {
    const { document } = render(
      "vital-sign-body-temperature-as-celcius-view",
      { value: "37.0" },
    );
    const abbr = document.querySelector("abbr.vital-sign-unit");
    expect(abbr).toBeTruthy();
    expect(abbr.getAttribute("title")).toBe("degrees Celsius");
    expect(abbr.textContent).toBe("°C");
  });

  it("sets aria-label from params.label", () => {
    const { document } = render(
      "vital-sign-body-temperature-as-celcius-view",
      { value: "37.0", label: "Temperature" },
    );
    expect(document.querySelector("span.vital-sign-body-temperature-as-celcius-view")
      .getAttribute("aria-label")).toBe("Temperature");
  });

  it("appends params.classes", () => {
    const { document } = render(
      "vital-sign-body-temperature-as-celcius-view",
      { value: "38.9", classes: "elevated" },
    );
    expect(document.querySelector(
      "span.vital-sign-body-temperature-as-celcius-view.elevated",
    )).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render(
      "vital-sign-body-temperature-as-celcius-view",
      { value: "37.0" },
    );
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
