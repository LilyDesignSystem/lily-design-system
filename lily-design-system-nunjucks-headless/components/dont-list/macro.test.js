import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("dont-list", () => {
  it("renders a <ul> with the base class", () => {
    const { document } = render("dont-list", {});
    expect(document.querySelector("ul.dont-list")).toBeTruthy();
  });

  it("sets aria-label from params.label", () => {
    const { document } = render("dont-list", { label: "Don't" });
    expect(document.querySelector("ul.dont-list").getAttribute("aria-label"))
      .toBe("Don't");
  });

  it("prefers aria-labelledby over aria-label", () => {
    const { document } = render("dont-list", {
      label: "Fallback",
      labelledBy: "h-dont",
    });
    const el = document.querySelector("ul.dont-list");
    expect(el.getAttribute("aria-labelledby")).toBe("h-dont");
    expect(el.hasAttribute("aria-label")).toBe(false);
  });

  it("appends params.classes", () => {
    const { document } = render("dont-list", { classes: "warning" });
    expect(document.querySelector("ul.dont-list.warning")).toBeTruthy();
  });

  it("renders caller block content", () => {
    const { document } = render(
      "dont-list",
      {},
      '<li class="dont-list-item">one</li>',
    );
    expect(document.querySelector("ul .dont-list-item")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("dont-list", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
