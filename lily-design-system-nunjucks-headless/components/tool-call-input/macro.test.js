import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

const name = "tool-call-input";

describe("tool-call-input", () => {
  it("renders a <div> with the base class", () => {
    expect(render(name, { text: "Hello" }).document.querySelector("div.tool-call-input")).toBeTruthy();
  });

  it("with a label it is a named group; without one it has neither role nor aria-label", () => {
    const a = render(name, { label: "Input", text: "x" }).document.querySelector("div");
    expect(a.getAttribute("role")).toBe("group");
    expect(a.getAttribute("aria-label")).toBe("Input");
    const b = render(name, { text: "x" }).document.querySelector("div");
    expect(b.hasAttribute("role")).toBe(false);
    expect(b.hasAttribute("aria-label")).toBe(false);
  });

  it("puts the base class first, then the consumer class", () => {
    expect(render(name, { classes: "mine", text: "x" }).document.querySelector("div").getAttribute("class")).toBe("tool-call-input mine");
  });

  it("renders text, html and caller content", () => {
    expect(render(name, { text: "Hello" }).document.querySelector("div").textContent).toBe("Hello");
    expect(render(name, { html: "<b>Hi</b>" }).document.querySelector("div > b")).toBeTruthy();
    expect(render(name, {}, "<i>c</i>").document.querySelector("div > i")).toBeTruthy();
  });

  it("sets id and extra attributes", () => {
    const el = render(name, { id: "x1", attributes: { "data-x": "1" }, text: "x" }).document.querySelector("div");
    expect(el.getAttribute("id")).toBe("x1");
    expect(el.getAttribute("data-x")).toBe("1");
  });

  it("contains no <style> or <script> tags or inline styles", () => {
    const { html } = render(name, { text: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
