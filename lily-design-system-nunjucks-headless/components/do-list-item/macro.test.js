import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("do-list-item", () => {
  it("renders an <li> with the base class", () => {
    const { document } = render("do-list-item", { text: "wash your hands" });
    const el = document.querySelector("li.do-list-item");
    expect(el).toBeTruthy();
    expect(el.textContent.trim()).toBe("wash your hands");
  });

  it("escapes params.text", () => {
    const { document } = render("do-list-item", { text: "A & B" });
    expect(document.querySelector("li.do-list-item").textContent.trim())
      .toBe("A & B");
  });

  it("renders params.html raw", () => {
    const { document } = render("do-list-item", {
      html: "<strong>wash</strong> your hands",
    });
    expect(document.querySelector("li.do-list-item strong")).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("do-list-item", {
      text: "x",
      classes: "primary",
    });
    expect(document.querySelector("li.do-list-item.primary")).toBeTruthy();
  });

  it("renders caller block content", () => {
    const { document } = render("do-list-item", {}, "<em>Do this</em>");
    expect(document.querySelector("li.do-list-item em").textContent)
      .toBe("Do this");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("do-list-item", { text: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
