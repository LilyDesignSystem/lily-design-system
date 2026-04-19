import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("option", () => {
  it("renders an <option> with value and text", () => {
    const { document } = render("option", { value: "gb", text: "UK" });
    const el = document.querySelector("option");
    expect(el).toBeTruthy();
    expect(el.getAttribute("value")).toBe("gb");
    expect(el.textContent.trim()).toBe("UK");
  });

  it("escapes params.text", () => {
    const { document } = render("option", { value: "x", text: "A & B" });
    expect(document.querySelector("option").textContent.trim()).toBe("A & B");
  });

  it("renders params.html raw", () => {
    const { document } = render("option", {
      value: "x",
      html: "<strong>X</strong>",
    });
    expect(document.querySelector("option strong").textContent).toBe("X");
  });

  it("sets selected when true", () => {
    const { document } = render("option", {
      value: "x",
      text: "X",
      selected: true,
    });
    expect(document.querySelector("option").hasAttribute("selected")).toBe(true);
  });

  it("sets disabled when true", () => {
    const { document } = render("option", {
      value: "x",
      text: "X",
      disabled: true,
    });
    expect(document.querySelector("option").hasAttribute("disabled")).toBe(true);
  });

  it("allows value='' for placeholder options", () => {
    const { document } = render("option", {
      value: "",
      text: "Choose…",
      disabled: true,
    });
    const el = document.querySelector("option");
    expect(el.getAttribute("value")).toBe("");
    expect(el.textContent.trim()).toBe("Choose…");
  });

  it("always has the base class", () => {
    const { document } = render("option", { value: "x", text: "X" });
    expect(document.querySelector("option").classList.contains("option")).toBe(true);
  });

  it("appends params.classes", () => {
    const { document } = render("option", {
      value: "x",
      text: "X",
      classes: "highlight",
    });
    expect(document.querySelector("option.option.highlight")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("option", { value: "x", text: "X" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
