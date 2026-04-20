import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("progress-circle", () => {
  it("renders a <div role=progressbar> with the base class", () => {
    const { document } = render("progress-circle", { value: 50 });
    const el = document.querySelector("div.progress-circle");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("progressbar");
  });

  it("renders aria-valuenow / min / max", () => {
    const { document } = render("progress-circle", {
      value: 65,
      min: 0,
      max: 100,
    });
    const el = document.querySelector("div.progress-circle");
    expect(el.getAttribute("aria-valuenow")).toBe("65");
    expect(el.getAttribute("aria-valuemin")).toBe("0");
    expect(el.getAttribute("aria-valuemax")).toBe("100");
  });

  it("emits CSS custom properties for the value when determinate", () => {
    const { document } = render("progress-circle", { value: 40, max: 50 });
    const style = document.querySelector("div.progress-circle").getAttribute("style");
    expect(style).toContain("--progress-value: 40");
    expect(style).toContain("--progress-max: 50");
  });

  it("omits aria-valuenow for indeterminate state", () => {
    const { document } = render("progress-circle", {});
    expect(document.querySelector("div.progress-circle").hasAttribute("aria-valuenow"))
      .toBe(false);
  });

  it("sets aria-label from params.label", () => {
    const { document } = render("progress-circle", {
      value: 40,
      label: "Loading",
    });
    expect(document.querySelector("div.progress-circle").getAttribute("aria-label"))
      .toBe("Loading");
  });

  it("appends params.classes", () => {
    const { document } = render("progress-circle", {
      value: 40,
      classes: "large",
    });
    expect(document.querySelector("div.progress-circle.large")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("progress-circle", { value: 40 });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
