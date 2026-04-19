import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("france-numero-d-identification-au-repertoire-input", () => {
  it("renders an <input type=text> with the base class", () => {
    const { document } = render(
      "france-numero-d-identification-au-repertoire-input",
      { id: "nir" },
    );
    const el = document.querySelector("input");
    expect(el.getAttribute("type")).toBe("text");
    expect(el.classList.contains(
      "france-numero-d-identification-au-repertoire-input",
    )).toBe(true);
  });

  it("sets inputmode=numeric and autocomplete=off", () => {
    const { document } = render(
      "france-numero-d-identification-au-repertoire-input",
      { id: "nir" },
    );
    const el = document.querySelector("input");
    expect(el.getAttribute("inputmode")).toBe("numeric");
    expect(el.getAttribute("autocomplete")).toBe("off");
    expect(el.getAttribute("maxlength")).toBe("21");
  });

  it("renders value", () => {
    const { document } = render(
      "france-numero-d-identification-au-repertoire-input",
      { id: "nir", value: "1 85 12 78 463 100 38" },
    );
    expect(document.querySelector("input").getAttribute("value"))
      .toBe("1 85 12 78 463 100 38");
  });

  it("supports aria-invalid and aria-errormessage", () => {
    const { document } = render(
      "france-numero-d-identification-au-repertoire-input",
      { id: "nir", invalid: true, errormessage: "nir-err" },
    );
    const el = document.querySelector("input");
    expect(el.getAttribute("aria-invalid")).toBe("true");
    expect(el.getAttribute("aria-errormessage")).toBe("nir-err");
  });

  it("appends params.classes", () => {
    const { document } = render(
      "france-numero-d-identification-au-repertoire-input",
      { id: "nir", classes: "wide" },
    );
    expect(document.querySelector(
      "input.france-numero-d-identification-au-repertoire-input.wide",
    )).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render(
      "france-numero-d-identification-au-repertoire-input",
      { id: "nir" },
    );
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
