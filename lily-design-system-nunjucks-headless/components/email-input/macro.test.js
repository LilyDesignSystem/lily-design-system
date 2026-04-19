import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("email-input", () => {
  it("renders an <input type=email> with the base class", () => {
    const { document } = render("email-input", { id: "e" });
    const el = document.querySelector("input");
    expect(el.getAttribute("type")).toBe("email");
    expect(el.classList.contains("email-input")).toBe(true);
  });

  it("defaults name to id", () => {
    const { document } = render("email-input", { id: "email" });
    expect(document.querySelector("input").getAttribute("name")).toBe("email");
  });

  it("renders value", () => {
    const { document } = render("email-input", {
      id: "e",
      value: "a@b.com",
    });
    expect(document.querySelector("input").getAttribute("value")).toBe("a@b.com");
  });

  it("supports multiple", () => {
    const { document } = render("email-input", {
      id: "e",
      multiple: true,
    });
    expect(document.querySelector("input").hasAttribute("multiple")).toBe(true);
  });

  it("sets aria-invalid and aria-errormessage", () => {
    const { document } = render("email-input", {
      id: "e",
      invalid: true,
      errormessage: "e-err",
    });
    const el = document.querySelector("input");
    expect(el.getAttribute("aria-invalid")).toBe("true");
    expect(el.getAttribute("aria-errormessage")).toBe("e-err");
  });

  it("appends params.classes", () => {
    const { document } = render("email-input", { id: "e", classes: "wide" });
    expect(document.querySelector("input.email-input.wide")).toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render("email-input", {
      id: "e",
      attributes: { "data-test": "ok" },
    });
    expect(document.querySelector("input").getAttribute("data-test")).toBe("ok");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("email-input", { id: "e" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
