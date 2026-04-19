import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("dont-list-item", () => {
  it("renders an <li> with the base class", () => {
    const { document } = render("dont-list-item", { text: "touch your face" });
    const el = document.querySelector("li.dont-list-item");
    expect(el).toBeTruthy();
    expect(el.textContent.trim()).toBe("touch your face");
  });

  it("escapes params.text", () => {
    const { document } = render("dont-list-item", { text: "A & B" });
    expect(document.querySelector("li.dont-list-item").textContent.trim())
      .toBe("A & B");
  });

  it("renders params.html raw", () => {
    const { document } = render("dont-list-item", {
      html: "<em>share</em> personal items",
    });
    expect(document.querySelector("li.dont-list-item em")).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("dont-list-item", {
      text: "x",
      classes: "warn",
    });
    expect(document.querySelector("li.dont-list-item.warn")).toBeTruthy();
  });

  it("renders caller block content", () => {
    const { document } = render("dont-list-item", {}, "<em>Don't</em>");
    expect(document.querySelector("li.dont-list-item em").textContent)
      .toBe("Don't");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("dont-list-item", { text: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
