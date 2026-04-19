import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("espana-tarjeta-sanitaria-individual-input", () => {
  it("renders an <input type=text> with the base class", () => {
    const { document } = render(
      "espana-tarjeta-sanitaria-individual-input",
      { id: "tsi" },
    );
    const el = document.querySelector("input");
    expect(el.getAttribute("type")).toBe("text");
    expect(el.classList.contains(
      "espana-tarjeta-sanitaria-individual-input",
    )).toBe(true);
  });

  it("accepts alphanumeric input (no inputmode=numeric)", () => {
    const { document } = render(
      "espana-tarjeta-sanitaria-individual-input",
      { id: "tsi" },
    );
    const el = document.querySelector("input");
    expect(el.hasAttribute("inputmode")).toBe(false);
    expect(el.getAttribute("pattern")).toMatch(/A-Za-z/);
  });

  it("sets autocomplete=off and spellcheck=false", () => {
    const { document } = render(
      "espana-tarjeta-sanitaria-individual-input",
      { id: "tsi" },
    );
    const el = document.querySelector("input");
    expect(el.getAttribute("autocomplete")).toBe("off");
    expect(el.getAttribute("spellcheck")).toBe("false");
  });

  it("renders value", () => {
    const { document } = render(
      "espana-tarjeta-sanitaria-individual-input",
      { id: "tsi", value: "BBBB090810C003" },
    );
    expect(document.querySelector("input").getAttribute("value"))
      .toBe("BBBB090810C003");
  });

  it("supports aria-invalid and aria-errormessage", () => {
    const { document } = render(
      "espana-tarjeta-sanitaria-individual-input",
      { id: "tsi", invalid: true, errormessage: "tsi-err" },
    );
    const el = document.querySelector("input");
    expect(el.getAttribute("aria-invalid")).toBe("true");
    expect(el.getAttribute("aria-errormessage")).toBe("tsi-err");
  });

  it("appends params.classes", () => {
    const { document } = render(
      "espana-tarjeta-sanitaria-individual-input",
      { id: "tsi", classes: "wide" },
    );
    expect(document.querySelector(
      "input.espana-tarjeta-sanitaria-individual-input.wide",
    )).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render(
      "espana-tarjeta-sanitaria-individual-input",
      { id: "tsi" },
    );
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
