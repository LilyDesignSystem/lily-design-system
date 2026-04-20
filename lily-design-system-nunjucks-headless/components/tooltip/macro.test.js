import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("tooltip", () => {
  it("renders a <span role=tooltip> with the base class", () => {
    const { document } = render("tooltip", { id: "t", text: "hi" });
    const el = document.querySelector("span.tooltip");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("tooltip");
    expect(el.getAttribute("id")).toBe("t");
  });

  it("is hidden by default", () => {
    const { document } = render("tooltip", { id: "t", text: "hi" });
    expect(document.querySelector("span.tooltip").hasAttribute("hidden"))
      .toBe(true);
  });

  it("omits hidden when params.hidden is false", () => {
    const { document } = render("tooltip", {
      id: "t",
      text: "hi",
      hidden: false,
    });
    expect(document.querySelector("span.tooltip").hasAttribute("hidden"))
      .toBe(false);
  });

  it("escapes params.text", () => {
    const { document } = render("tooltip", {
      id: "t",
      text: "A & B",
    });
    expect(document.querySelector("span.tooltip").textContent.trim())
      .toBe("A & B");
  });

  it("renders params.html raw", () => {
    const { document } = render("tooltip", {
      id: "t",
      html: "<strong>Help</strong>",
    });
    expect(document.querySelector("span.tooltip strong")).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("tooltip", {
      id: "t",
      text: "x",
      classes: "inline",
    });
    expect(document.querySelector("span.tooltip.inline")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("tooltip", { id: "t", text: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
