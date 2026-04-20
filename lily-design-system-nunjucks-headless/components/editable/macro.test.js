import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("editable", () => {
  it("renders a <span> with role=textbox and contenteditable", () => {
    const { document } = render("editable", { text: "Click to edit" });
    const el = document.querySelector("span.editable");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("textbox");
    expect(el.getAttribute("contenteditable")).toBe("false");
  });

  it("sets contenteditable=true when editing", () => {
    const { document } = render("editable", { text: "x", editing: true });
    expect(document.querySelector("span").getAttribute("contenteditable"))
      .toBe("true");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("editable", { text: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
