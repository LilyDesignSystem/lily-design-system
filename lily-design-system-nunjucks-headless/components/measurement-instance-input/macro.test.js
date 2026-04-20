import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("measurement-instance-input", () => {
  it("renders a number input and a unit select", () => {
    const { document } = render("measurement-instance-input", {
      id: "m",
      name: "m",
      value: 75,
      unit: "kg",
      units: [
        { value: "kg", text: "kg" },
        { value: "lb", text: "lb" },
      ],
      inputLabel: "Weight",
      selectLabel: "Weight unit",
    });
    const num = document.querySelector("input.measurement-instance-input-value");
    expect(num).toBeTruthy();
    expect(num.getAttribute("type")).toBe("number");
    expect(num.getAttribute("id")).toBe("m-value");
    expect(num.getAttribute("name")).toBe("m-value");
    expect(num.getAttribute("value")).toBe("75");

    const sel = document.querySelector("select.measurement-instance-input-unit");
    expect(sel).toBeTruthy();
    expect(sel.getAttribute("id")).toBe("m-unit");
    expect(sel.querySelectorAll("option").length).toBe(2);
    expect(sel.querySelector("option[selected]").getAttribute("value")).toBe("kg");
  });

  it("supports disabled", () => {
    const { document } = render("measurement-instance-input", {
      units: [{ value: "a" }],
      disabled: true,
    });
    expect(document.querySelector("input").hasAttribute("disabled")).toBe(true);
    expect(document.querySelector("select").hasAttribute("disabled")).toBe(true);
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("measurement-instance-input", { units: [] });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
