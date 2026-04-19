import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("checkbox-group", () => {
  it("renders a <div role=group> with the base class", () => {
    const { document } = render("checkbox-group", { label: "Conditions" });
    const el = document.querySelector("div.checkbox-group");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("group");
  });

  it("sets aria-label from params.label", () => {
    const { document } = render("checkbox-group", { label: "Conditions" });
    expect(
      document.querySelector("div.checkbox-group").getAttribute("aria-label"),
    ).toBe("Conditions");
  });

  it("prefers aria-labelledby over aria-label", () => {
    const { document } = render("checkbox-group", {
      label: "Fallback",
      labelledBy: "h",
    });
    const el = document.querySelector("div.checkbox-group");
    expect(el.getAttribute("aria-labelledby")).toBe("h");
    expect(el.hasAttribute("aria-label")).toBe(false);
  });

  it("sets aria-required when params.required is true", () => {
    const { document } = render("checkbox-group", {
      label: "x",
      required: true,
    });
    expect(
      document.querySelector("div.checkbox-group").getAttribute("aria-required"),
    ).toBe("true");
  });

  it("appends params.classes", () => {
    const { document } = render("checkbox-group", {
      label: "x",
      classes: "inline",
    });
    expect(document.querySelector("div.checkbox-group.inline")).toBeTruthy();
  });

  it("renders caller block content", () => {
    const { document } = render(
      "checkbox-group",
      { label: "x" },
      '<input type="checkbox" id="c1">',
    );
    expect(document.querySelector("div.checkbox-group input#c1")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("checkbox-group", { label: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
