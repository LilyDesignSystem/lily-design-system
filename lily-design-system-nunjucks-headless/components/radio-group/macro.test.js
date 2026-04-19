import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("radio-group", () => {
  it("renders a <div role=radiogroup> with the base class", () => {
    const { document } = render("radio-group", { label: "Where" });
    const el = document.querySelector("div.radio-group");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("radiogroup");
  });

  it("sets aria-label from params.label", () => {
    const { document } = render("radio-group", { label: "Where" });
    expect(document.querySelector("div.radio-group").getAttribute("aria-label"))
      .toBe("Where");
  });

  it("prefers aria-labelledby over aria-label", () => {
    const { document } = render("radio-group", {
      label: "Fallback",
      labelledBy: "h",
    });
    const el = document.querySelector("div.radio-group");
    expect(el.getAttribute("aria-labelledby")).toBe("h");
    expect(el.hasAttribute("aria-label")).toBe(false);
  });

  it("sets aria-describedby", () => {
    const { document } = render("radio-group", {
      label: "x",
      describedBy: "x-hint",
    });
    expect(
      document.querySelector("div.radio-group").getAttribute("aria-describedby"),
    ).toBe("x-hint");
  });

  it("sets aria-required when params.required is true", () => {
    const { document } = render("radio-group", {
      label: "x",
      required: true,
    });
    expect(
      document.querySelector("div.radio-group").getAttribute("aria-required"),
    ).toBe("true");
  });

  it("appends params.classes", () => {
    const { document } = render("radio-group", {
      label: "x",
      classes: "inline",
    });
    expect(document.querySelector("div.radio-group.inline")).toBeTruthy();
  });

  it("renders caller block content", () => {
    const { document } = render(
      "radio-group",
      { label: "x" },
      '<input type="radio" id="r1">',
    );
    expect(document.querySelector("div.radio-group input#r1")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("radio-group", { label: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
