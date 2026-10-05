import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

const name = "mark";

describe("mark", () => {
  it("renders a <mark> with the base class", () => {
    expect(render(name, { text: "Hello" }).document.querySelector("mark.mark")).toBeTruthy();
  });

  it("puts the base class first, then the consumer class", () => {
    expect(render(name, { classes: "mine", text: "x" }).document.querySelector("mark").getAttribute("class")).toBe("mark mine");
  });

  it("renders text, html and caller content", () => {
    expect(render(name, { text: "Hello" }).document.querySelector("mark").textContent).toBe("Hello");
    expect(render(name, { html: "<b>Hi</b>" }).document.querySelector("mark > b")).toBeTruthy();
    expect(render(name, {}, "<i>c</i>").document.querySelector("mark > i")).toBeTruthy();
  });

  it("sets id and extra attributes", () => {
    const el = render(name, { id: "x1", attributes: { "data-x": "1" }, text: "x" }).document.querySelector("mark");
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
