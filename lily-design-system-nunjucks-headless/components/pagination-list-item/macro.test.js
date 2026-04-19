import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("pagination-list-item", () => {
  it("renders an <li> with the base class", () => {
    const { document } = render("pagination-list-item", { text: "1" });
    expect(document.querySelector("li.pagination-list-item")).toBeTruthy();
  });

  it("renders caller block content for interactive items", () => {
    const { document } = render(
      "pagination-list-item",
      {},
      '<a href="#">1</a>',
    );
    expect(document.querySelector("li a").textContent).toBe("1");
  });

  it("renders an ellipsis variant when params.ellipsis is true", () => {
    const { document } = render("pagination-list-item", { ellipsis: true });
    const el = document.querySelector("li.pagination-list-item");
    expect(el.getAttribute("data-variant")).toBe("ellipsis");
    expect(el.getAttribute("aria-hidden")).toBe("true");
    const span = el.querySelector("span.pagination-list-item-ellipsis");
    expect(span).toBeTruthy();
    expect(span.textContent.trim()).toBe("…");
  });

  it("respects a custom ellipsis text", () => {
    const { document } = render("pagination-list-item", {
      ellipsis: true,
      text: "...",
    });
    expect(
      document.querySelector(".pagination-list-item-ellipsis").textContent.trim(),
    ).toBe("...");
  });

  it("omits data-variant when not an ellipsis", () => {
    const { document } = render("pagination-list-item", { text: "1" });
    expect(document.querySelector("li.pagination-list-item").hasAttribute("data-variant"))
      .toBe(false);
  });

  it("appends params.classes", () => {
    const { document } = render("pagination-list-item", {
      text: "1",
      classes: "first",
    });
    expect(document.querySelector("li.pagination-list-item.first")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("pagination-list-item", { text: "1" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
