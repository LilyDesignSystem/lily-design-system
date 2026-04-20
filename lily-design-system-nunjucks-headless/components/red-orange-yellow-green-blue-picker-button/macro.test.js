import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("red-orange-yellow-green-blue-picker-button", () => {
  it("renders a <button role=radio> with the base class", () => {
    const { document } = render("red-orange-yellow-green-blue-picker-button", {
      status: "yellow",
    });
    const el = document.querySelector(
      "button.red-orange-yellow-green-blue-picker-button",
    );
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("radio");
  });

  it("sets data-status from params.status for each level", () => {
    for (const status of ["red", "orange", "yellow", "green", "blue"]) {
      const { document } = render("red-orange-yellow-green-blue-picker-button", {
        status,
      });
      expect(
        document
          .querySelector("button.red-orange-yellow-green-blue-picker-button")
          .getAttribute("data-status"),
      ).toBe(status);
    }
  });

  it("uses status name as default text", () => {
    const { document } = render("red-orange-yellow-green-blue-picker-button", {
      status: "orange",
    });
    expect(
      document
        .querySelector("button.red-orange-yellow-green-blue-picker-button")
        .textContent.trim(),
    ).toBe("Orange");
  });

  it("sets aria-checked and tabindex based on checked", () => {
    const { document: a } = render("red-orange-yellow-green-blue-picker-button", {
      status: "blue",
      checked: true,
    });
    const aEl = a.querySelector("button");
    expect(aEl.getAttribute("aria-checked")).toBe("true");
    expect(aEl.getAttribute("tabindex")).toBe("0");

    const { document: b } = render("red-orange-yellow-green-blue-picker-button", {
      status: "blue",
    });
    const bEl = b.querySelector("button");
    expect(bEl.getAttribute("aria-checked")).toBe("false");
    expect(bEl.getAttribute("tabindex")).toBe("-1");
  });

  it("supports disabled", () => {
    const { document } = render("red-orange-yellow-green-blue-picker-button", {
      status: "red",
      disabled: true,
    });
    expect(
      document
        .querySelector("button.red-orange-yellow-green-blue-picker-button")
        .hasAttribute("disabled"),
    ).toBe(true);
  });

  it("appends params.classes", () => {
    const { document } = render("red-orange-yellow-green-blue-picker-button", {
      status: "red",
      classes: "large",
    });
    expect(
      document.querySelector("button.red-orange-yellow-green-blue-picker-button.large"),
    ).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("red-orange-yellow-green-blue-picker-button", {
      status: "green",
    });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
