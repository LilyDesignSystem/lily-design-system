import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("badge", () => {
  it("renders a <span> with the base class", () => {
    const { document } = render("badge", { text: "New" });
    const el = document.querySelector("span");
    expect(el).toBeTruthy();
    expect(el.classList.contains("badge")).toBe(true);
    expect(el.textContent.trim()).toBe("New");
  });

  it("escapes params.text", () => {
    const { document } = render("badge", { text: "A & B" });
    expect(document.querySelector("span").textContent.trim()).toBe("A & B");
  });

  it("renders params.html raw", () => {
    const { document } = render("badge", { html: "<em>New</em>" });
    expect(document.querySelector("span em")).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("badge", { text: "x", classes: "extra" });
    expect(document.querySelector("span.badge.extra")).toBeTruthy();
  });

  it("sets aria-label from params.label", () => {
    const { document } = render("badge", { text: "5", label: "5 new items" });
    expect(document.querySelector("span").getAttribute("aria-label"))
      .toBe("5 new items");
  });

  it("omits aria-label when no label is given", () => {
    const { document } = render("badge", { text: "x" });
    expect(document.querySelector("span").hasAttribute("aria-label")).toBe(false);
  });

  it("renders params.attributes as HTML attributes", () => {
    const { document } = render("badge", {
      text: "x",
      attributes: { "data-count": "5" },
    });
    expect(document.querySelector("span").getAttribute("data-count")).toBe("5");
  });

  it("renders caller block content", () => {
    const { document } = render("badge", {}, "<em>Call</em>");
    expect(document.querySelector("span em").textContent).toBe("Call");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("badge", { text: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
