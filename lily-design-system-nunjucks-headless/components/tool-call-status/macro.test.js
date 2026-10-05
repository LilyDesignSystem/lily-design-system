import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

const name = "tool-call-status";

describe("tool-call-status", () => {
  it("renders a <span> with the base class", () => {
    expect(render(name, { text: "Hello" }).document.querySelector("span.tool-call-status")).toBeTruthy();
  });

  it("sets data-status from status, and omits it without one", () => {
    expect(render(name, { status: "running", text: "x" }).document.querySelector("span").getAttribute("data-status")).toBe("running");
    expect(render(name, { text: "x" }).document.querySelector("span").hasAttribute("data-status")).toBe(false);
  });

  it("puts the base class first, then the consumer class", () => {
    expect(render(name, { classes: "mine", text: "x" }).document.querySelector("span").getAttribute("class")).toBe("tool-call-status mine");
  });

  it("renders text, html and caller content", () => {
    expect(render(name, { text: "Hello" }).document.querySelector("span").textContent).toBe("Hello");
    expect(render(name, { html: "<b>Hi</b>" }).document.querySelector("span > b")).toBeTruthy();
    expect(render(name, {}, "<i>c</i>").document.querySelector("span > i")).toBeTruthy();
  });

  it("sets id and extra attributes", () => {
    const el = render(name, { id: "x1", attributes: { "data-x": "1" }, text: "x" }).document.querySelector("span");
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
