import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("editable-form", () => {
  it("renders a <form> with the base class", () => {
    const { document } = render("editable-form", { label: "Edit name" });
    const el = document.querySelector("form.editable-form");
    expect(el).toBeTruthy();
    expect(el.getAttribute("aria-label")).toBe("Edit name");
    expect(el.getAttribute("method")).toBe("post");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("editable-form", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
