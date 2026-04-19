import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("vital-sign-heart-rate-as-beats-per-minute-input", () => {
  it("renders an <input type=number> with the base class", () => {
    const { document } = render(
      "vital-sign-heart-rate-as-beats-per-minute-input",
      { id: "hr" },
    );
    const el = document.querySelector("input");
    expect(el.getAttribute("type")).toBe("number");
    expect(el.classList.contains(
      "vital-sign-heart-rate-as-beats-per-minute-input",
    )).toBe(true);
  });

  it("defaults min=30, max=250, step=1", () => {
    const { document } = render(
      "vital-sign-heart-rate-as-beats-per-minute-input",
      { id: "hr" },
    );
    const el = document.querySelector("input");
    expect(el.getAttribute("min")).toBe("30");
    expect(el.getAttribute("max")).toBe("250");
    expect(el.getAttribute("step")).toBe("1");
    expect(el.getAttribute("inputmode")).toBe("numeric");
  });

  it("respects custom min/max/step", () => {
    const { document } = render(
      "vital-sign-heart-rate-as-beats-per-minute-input",
      { id: "hr", min: 40, max: 180, step: 2 },
    );
    const el = document.querySelector("input");
    expect(el.getAttribute("min")).toBe("40");
    expect(el.getAttribute("max")).toBe("180");
    expect(el.getAttribute("step")).toBe("2");
  });

  it("renders value", () => {
    const { document } = render(
      "vital-sign-heart-rate-as-beats-per-minute-input",
      { id: "hr", value: 72 },
    );
    expect(document.querySelector("input").getAttribute("value")).toBe("72");
  });

  it("supports aria-invalid and aria-errormessage", () => {
    const { document } = render(
      "vital-sign-heart-rate-as-beats-per-minute-input",
      { id: "hr", invalid: true, errormessage: "hr-err" },
    );
    const el = document.querySelector("input");
    expect(el.getAttribute("aria-invalid")).toBe("true");
    expect(el.getAttribute("aria-errormessage")).toBe("hr-err");
  });

  it("appends params.classes", () => {
    const { document } = render(
      "vital-sign-heart-rate-as-beats-per-minute-input",
      { id: "hr", classes: "narrow" },
    );
    expect(document.querySelector(
      "input.vital-sign-heart-rate-as-beats-per-minute-input.narrow",
    )).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render(
      "vital-sign-heart-rate-as-beats-per-minute-input",
      { id: "hr" },
    );
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
