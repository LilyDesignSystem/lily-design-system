import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("checkbox-input", () => {
  it("renders an <input type=checkbox> with the base class", () => {
    const { document } = render("checkbox-input", {
      id: "t",
      name: "terms",
      value: "yes",
    });
    const el = document.querySelector("input");
    expect(el.getAttribute("type")).toBe("checkbox");
    expect(el.classList.contains("checkbox-input")).toBe(true);
  });

  it("sets id, name, and value", () => {
    const { document } = render("checkbox-input", {
      id: "t",
      name: "terms",
      value: "yes",
    });
    const el = document.querySelector("input");
    expect(el.getAttribute("id")).toBe("t");
    expect(el.getAttribute("name")).toBe("terms");
    expect(el.getAttribute("value")).toBe("yes");
  });

  it("sets checked when params.checked is true", () => {
    const { document } = render("checkbox-input", { id: "t", checked: true });
    expect(document.querySelector("input").hasAttribute("checked")).toBe(true);
  });

  it("sets required and disabled", () => {
    const { document } = render("checkbox-input", {
      id: "t",
      required: true,
      disabled: true,
    });
    const el = document.querySelector("input");
    expect(el.hasAttribute("required")).toBe(true);
    expect(el.hasAttribute("disabled")).toBe(true);
  });

  it("emits data-indeterminate when params.indeterminate is true", () => {
    const { document } = render("checkbox-input", {
      id: "t",
      indeterminate: true,
    });
    expect(document.querySelector("input").getAttribute("data-indeterminate"))
      .toBe("true");
  });

  it("appends params.classes", () => {
    const { document } = render("checkbox-input", {
      id: "t",
      classes: "extra",
    });
    expect(document.querySelector("input.checkbox-input.extra")).toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render("checkbox-input", {
      id: "t",
      attributes: { "data-conditional": "yes" },
    });
    expect(document.querySelector("input").getAttribute("data-conditional"))
      .toBe("yes");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("checkbox-input", { id: "t" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
