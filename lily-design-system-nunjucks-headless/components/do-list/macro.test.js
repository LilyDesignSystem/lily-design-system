import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("do-list", () => {
  it("renders a <ul> with the base class", () => {
    const { document } = render("do-list", {});
    expect(document.querySelector("ul.do-list")).toBeTruthy();
  });

  it("sets aria-label from params.label", () => {
    const { document } = render("do-list", { label: "Do" });
    expect(document.querySelector("ul.do-list").getAttribute("aria-label"))
      .toBe("Do");
  });

  it("prefers aria-labelledby over aria-label", () => {
    const { document } = render("do-list", {
      label: "Fallback",
      labelledBy: "h-do",
    });
    const el = document.querySelector("ul.do-list");
    expect(el.getAttribute("aria-labelledby")).toBe("h-do");
    expect(el.hasAttribute("aria-label")).toBe(false);
  });

  it("appends params.classes", () => {
    const { document } = render("do-list", { classes: "wide" });
    expect(document.querySelector("ul.do-list.wide")).toBeTruthy();
  });

  it("renders caller block content", () => {
    const { document } = render(
      "do-list",
      {},
      '<li class="do-list-item">one</li>',
    );
    expect(document.querySelector("ul .do-list-item")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("do-list", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
