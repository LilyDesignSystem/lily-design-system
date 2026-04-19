import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("button-input", () => {
  it("renders an <input type=button> with the base class", () => {
    const { document } = render("button-input", { value: "Clear" });
    const el = document.querySelector("input");
    expect(el.getAttribute("type")).toBe("button");
    expect(el.classList.contains("button-input")).toBe(true);
  });

  it("sets value as the visible label", () => {
    const { document } = render("button-input", { value: "Clear form" });
    expect(document.querySelector("input").getAttribute("value"))
      .toBe("Clear form");
  });

  it("defaults value to empty when not provided", () => {
    const { document } = render("button-input", {});
    expect(document.querySelector("input").getAttribute("value")).toBe("");
  });

  it("sets id and name when provided", () => {
    const { document } = render("button-input", {
      id: "clear",
      name: "action",
      value: "Clear",
    });
    const el = document.querySelector("input");
    expect(el.getAttribute("id")).toBe("clear");
    expect(el.getAttribute("name")).toBe("action");
  });

  it("omits id and name when not provided", () => {
    const { document } = render("button-input", { value: "x" });
    const el = document.querySelector("input");
    expect(el.hasAttribute("id")).toBe(false);
    expect(el.hasAttribute("name")).toBe(false);
  });

  it("supports disabled", () => {
    const { document } = render("button-input", { value: "x", disabled: true });
    expect(document.querySelector("input").hasAttribute("disabled")).toBe(true);
  });

  it("sets aria-label when provided", () => {
    const { document } = render("button-input", {
      value: "×",
      label: "Close dialog",
    });
    expect(document.querySelector("input").getAttribute("aria-label"))
      .toBe("Close dialog");
  });

  it("renders params.attributes (e.g. onclick)", () => {
    const { document } = render("button-input", {
      value: "Reset",
      attributes: { onclick: "form.reset()" },
    });
    expect(document.querySelector("input").getAttribute("onclick"))
      .toBe("form.reset()");
  });

  it("appends params.classes", () => {
    const { document } = render("button-input", {
      value: "x",
      classes: "secondary",
    });
    expect(document.querySelector("input.button-input.secondary")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("button-input", { value: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
