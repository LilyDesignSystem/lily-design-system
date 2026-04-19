import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("textarea", () => {
  it("renders a <textarea> with the base class", () => {
    const { document } = render("textarea", { id: "t" });
    const el = document.querySelector("textarea");
    expect(el).toBeTruthy();
    expect(el.classList.contains("textarea")).toBe(true);
  });

  it("sets id and defaults name to id", () => {
    const { document } = render("textarea", { id: "feedback" });
    const el = document.querySelector("textarea");
    expect(el.getAttribute("id")).toBe("feedback");
    expect(el.getAttribute("name")).toBe("feedback");
  });

  it("defaults rows to 5", () => {
    const { document } = render("textarea", { id: "t" });
    expect(document.querySelector("textarea").getAttribute("rows")).toBe("5");
  });

  it("respects a custom rows", () => {
    const { document } = render("textarea", { id: "t", rows: 10 });
    expect(document.querySelector("textarea").getAttribute("rows")).toBe("10");
  });

  it("renders value as element content", () => {
    const { document } = render("textarea", {
      id: "t",
      value: "Hello world",
    });
    expect(document.querySelector("textarea").textContent).toBe("Hello world");
  });

  it("escapes special characters in value", () => {
    const { document } = render("textarea", {
      id: "t",
      value: "<script>alert(1)</script>",
    });
    expect(document.querySelector("textarea").textContent)
      .toBe("<script>alert(1)</script>");
    const { html } = render("textarea", {
      id: "t",
      value: "<script>alert(1)</script>",
    });
    expect(html).not.toContain("<script>alert(1)</script>");
  });

  it("sets aria-invalid, aria-errormessage, aria-describedby", () => {
    const { document } = render("textarea", {
      id: "t",
      invalid: true,
      errormessage: "t-err",
      describedBy: "t-hint",
    });
    const el = document.querySelector("textarea");
    expect(el.getAttribute("aria-invalid")).toBe("true");
    expect(el.getAttribute("aria-errormessage")).toBe("t-err");
    expect(el.getAttribute("aria-describedby")).toBe("t-hint");
  });

  it("renders required, disabled, readonly", () => {
    const { document } = render("textarea", {
      id: "t",
      required: true,
      disabled: true,
      readonly: true,
    });
    const el = document.querySelector("textarea");
    expect(el.hasAttribute("required")).toBe(true);
    expect(el.hasAttribute("disabled")).toBe(true);
    expect(el.hasAttribute("readonly")).toBe(true);
  });

  it("appends params.classes", () => {
    const { document } = render("textarea", { id: "t", classes: "tall" });
    expect(document.querySelector("textarea.textarea.tall")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("textarea", { id: "t" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
