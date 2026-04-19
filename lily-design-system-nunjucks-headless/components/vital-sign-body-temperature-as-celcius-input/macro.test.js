import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("vital-sign-body-temperature-as-celcius-input", () => {
  it("renders an <input type=number> with the base class", () => {
    const { document } = render(
      "vital-sign-body-temperature-as-celcius-input",
      { id: "temp" },
    );
    const el = document.querySelector("input");
    expect(el.getAttribute("type")).toBe("number");
    expect(el.classList.contains(
      "vital-sign-body-temperature-as-celcius-input",
    )).toBe(true);
  });

  it("defaults min=30, max=45, step=0.1, inputmode=decimal", () => {
    const { document } = render(
      "vital-sign-body-temperature-as-celcius-input",
      { id: "temp" },
    );
    const el = document.querySelector("input");
    expect(el.getAttribute("min")).toBe("30");
    expect(el.getAttribute("max")).toBe("45");
    expect(el.getAttribute("step")).toBe("0.1");
    expect(el.getAttribute("inputmode")).toBe("decimal");
  });

  it("renders decimal value", () => {
    const { document } = render(
      "vital-sign-body-temperature-as-celcius-input",
      { id: "temp", value: "37.2" },
    );
    expect(document.querySelector("input").getAttribute("value")).toBe("37.2");
  });

  it("supports aria-invalid and aria-errormessage", () => {
    const { document } = render(
      "vital-sign-body-temperature-as-celcius-input",
      { id: "temp", invalid: true, errormessage: "temp-err" },
    );
    const el = document.querySelector("input");
    expect(el.getAttribute("aria-invalid")).toBe("true");
    expect(el.getAttribute("aria-errormessage")).toBe("temp-err");
  });

  it("appends params.classes", () => {
    const { document } = render(
      "vital-sign-body-temperature-as-celcius-input",
      { id: "temp", classes: "narrow" },
    );
    expect(document.querySelector(
      "input.vital-sign-body-temperature-as-celcius-input.narrow",
    )).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render(
      "vital-sign-body-temperature-as-celcius-input",
      { id: "temp" },
    );
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
