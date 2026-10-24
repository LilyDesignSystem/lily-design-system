import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("convertDiv", () => {
  it("renders a div with the base class", () => {
    const { document } = render("convert-div", { text: "Example", label: "Currency converter" });
    const el = document.querySelector("div.convert-div");
    expect(el).toBeTruthy();
    expect(el.textContent.trim()).toBe("Example");
  });

  it("appends params.classes", () => {
    const { document } = render("convert-div", { text: "x", classes: "extra", label: "Currency converter" });
    expect(document.querySelector(".convert-div.extra")).toBeTruthy();
  });

  it("is a named group", () => {
    const { document } = render("convert-div", { text: "x", label: "Currency converter" });
    const el = document.querySelector(".convert-div");
    expect(el.getAttribute("role")).toBe("group");
    expect(el.getAttribute("aria-label")).toBe("Currency converter");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("convert-div", { text: "x", label: "Currency converter" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
