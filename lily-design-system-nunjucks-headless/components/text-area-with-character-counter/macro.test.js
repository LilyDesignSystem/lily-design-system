import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("text-area-with-character-counter", () => {
  it("renders a <textarea> and a counter <output>", () => {
    const { document } = render("text-area-with-character-counter", {
      id: "msg",
      name: "msg",
      maximum: 200,
      value: "Hello",
    });
    const ta = document.querySelector("textarea.text-area-with-character-counter-textarea");
    expect(ta).toBeTruthy();
    expect(ta.getAttribute("maxlength")).toBe("200");
    expect(ta.textContent).toBe("Hello");
    const out = document.querySelector("output.text-area-with-character-counter-counter");
    expect(out).toBeTruthy();
    expect(out.getAttribute("aria-live")).toBe("polite");
    expect(out.textContent.trim()).toBe("5 of 200 characters");
  });

  it("omits the counter when no maximum is given", () => {
    const { document } = render("text-area-with-character-counter", { id: "x" });
    expect(document.querySelector("output")).toBeFalsy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("text-area-with-character-counter", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
