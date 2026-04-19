import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("file-input", () => {
  it("renders an <input type=file> with the base class", () => {
    const { document } = render("file-input", { id: "f" });
    const el = document.querySelector("input");
    expect(el.getAttribute("type")).toBe("file");
    expect(el.classList.contains("file-input")).toBe(true);
  });

  it("renders accept, multiple, capture", () => {
    const { document } = render("file-input", {
      id: "f",
      accept: "image/*",
      multiple: true,
      capture: "environment",
    });
    const el = document.querySelector("input");
    expect(el.getAttribute("accept")).toBe("image/*");
    expect(el.hasAttribute("multiple")).toBe(true);
    expect(el.getAttribute("capture")).toBe("environment");
  });

  it("supports required, disabled, aria-invalid", () => {
    const { document } = render("file-input", {
      id: "f",
      required: true,
      disabled: true,
      invalid: true,
    });
    const el = document.querySelector("input");
    expect(el.hasAttribute("required")).toBe(true);
    expect(el.hasAttribute("disabled")).toBe(true);
    expect(el.getAttribute("aria-invalid")).toBe("true");
  });

  it("appends params.classes", () => {
    const { document } = render("file-input", { id: "f", classes: "wide" });
    expect(document.querySelector("input.file-input.wide")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("file-input", { id: "f" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
