import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("code", () => {
  it("renders a <code> with the base class", () => {
    const { document } = render("code", { text: "const x = 1" });
    const el = document.querySelector("code");
    expect(el).toBeTruthy();
    expect(el.classList.contains("code")).toBe(true);
    expect(el.textContent.trim()).toBe("const x = 1");
  });

  it("escapes params.text", () => {
    const { document } = render("code", {
      text: "<script>alert(1)</script>",
    });
    expect(document.querySelector("code").textContent.trim())
      .toBe("<script>alert(1)</script>");
  });

  it("renders params.html raw", () => {
    const { document } = render("code", { html: "<em>var</em> x" });
    expect(document.querySelector("code em")).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("code", { text: "x", classes: "small" });
    expect(document.querySelector("code.code.small")).toBeTruthy();
  });

  it("renders caller block content", () => {
    const { document } = render("code", {}, "<em>foo</em>");
    expect(document.querySelector("code em").textContent).toBe("foo");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("code", { text: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
