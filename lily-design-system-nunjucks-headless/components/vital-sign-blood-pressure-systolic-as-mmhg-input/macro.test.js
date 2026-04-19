import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("vital-sign-blood-pressure-systolic-as-mmhg-input", () => {
  it("renders an <input type=number> with the base class", () => {
    const { document } = render(
      "vital-sign-blood-pressure-systolic-as-mmhg-input",
      { id: "sys" },
    );
    const el = document.querySelector("input");
    expect(el.getAttribute("type")).toBe("number");
    expect(el.classList.contains(
      "vital-sign-blood-pressure-systolic-as-mmhg-input",
    )).toBe(true);
  });

  it("defaults min=50, max=250, step=1, inputmode=numeric", () => {
    const { document } = render(
      "vital-sign-blood-pressure-systolic-as-mmhg-input",
      { id: "sys" },
    );
    const el = document.querySelector("input");
    expect(el.getAttribute("min")).toBe("50");
    expect(el.getAttribute("max")).toBe("250");
    expect(el.getAttribute("step")).toBe("1");
    expect(el.getAttribute("inputmode")).toBe("numeric");
  });

  it("renders value", () => {
    const { document } = render(
      "vital-sign-blood-pressure-systolic-as-mmhg-input",
      { id: "sys", value: 118 },
    );
    expect(document.querySelector("input").getAttribute("value")).toBe("118");
  });

  it("supports aria-invalid", () => {
    const { document } = render(
      "vital-sign-blood-pressure-systolic-as-mmhg-input",
      { id: "sys", invalid: true },
    );
    expect(document.querySelector("input").getAttribute("aria-invalid"))
      .toBe("true");
  });

  it("appends params.classes", () => {
    const { document } = render(
      "vital-sign-blood-pressure-systolic-as-mmhg-input",
      { id: "sys", classes: "narrow" },
    );
    expect(document.querySelector(
      "input.vital-sign-blood-pressure-systolic-as-mmhg-input.narrow",
    )).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render(
      "vital-sign-blood-pressure-systolic-as-mmhg-input",
      { id: "sys" },
    );
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
