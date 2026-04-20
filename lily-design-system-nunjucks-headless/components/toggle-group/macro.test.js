import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("toggle-group", () => {
  it("renders a <div role=group> with the base class", () => {
    const { document } = render("toggle-group", { label: "Formatting" });
    const el = document.querySelector("div.toggle-group");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("group");
    expect(el.getAttribute("aria-label")).toBe("Formatting");
  });

  it("prefers aria-labelledby over aria-label", () => {
    const { document } = render("toggle-group", {
      label: "x",
      labelledBy: "h",
    });
    const el = document.querySelector("div.toggle-group");
    expect(el.getAttribute("aria-labelledby")).toBe("h");
    expect(el.hasAttribute("aria-label")).toBe(false);
  });

  it("renders caller block content", () => {
    const { document } = render(
      "toggle-group",
      { label: "Formatting" },
      '<button class="toggle-button">Bold</button>',
    );
    expect(document.querySelector("div.toggle-group .toggle-button")).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("toggle-group", {
      label: "x",
      classes: "vertical",
    });
    expect(document.querySelector("div.toggle-group.vertical")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("toggle-group", { label: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
