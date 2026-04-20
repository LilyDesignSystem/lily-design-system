import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("red-amber-green-picker-button", () => {
  it("renders a <button role=radio> with the base class", () => {
    const { document } = render("red-amber-green-picker-button", {
      status: "amber",
    });
    const el = document.querySelector("button.red-amber-green-picker-button");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("radio");
  });

  it("sets data-status from params.status", () => {
    const { document } = render("red-amber-green-picker-button", {
      status: "green",
    });
    expect(
      document.querySelector("button.red-amber-green-picker-button").getAttribute("data-status"),
    ).toBe("green");
  });

  it("uses status name as default text", () => {
    const { document } = render("red-amber-green-picker-button", {
      status: "red",
    });
    expect(
      document.querySelector("button.red-amber-green-picker-button").textContent.trim(),
    ).toBe("Red");
  });

  it("sets aria-checked and tabindex based on checked", () => {
    const { document: a } = render("red-amber-green-picker-button", {
      status: "red",
      checked: true,
    });
    const aEl = a.querySelector("button");
    expect(aEl.getAttribute("aria-checked")).toBe("true");
    expect(aEl.getAttribute("tabindex")).toBe("0");

    const { document: b } = render("red-amber-green-picker-button", {
      status: "red",
    });
    const bEl = b.querySelector("button");
    expect(bEl.getAttribute("aria-checked")).toBe("false");
    expect(bEl.getAttribute("tabindex")).toBe("-1");
  });

  it("supports disabled", () => {
    const { document } = render("red-amber-green-picker-button", {
      status: "red",
      disabled: true,
    });
    expect(document.querySelector("button.red-amber-green-picker-button").hasAttribute("disabled"))
      .toBe(true);
  });

  it("appends params.classes", () => {
    const { document } = render("red-amber-green-picker-button", {
      status: "red",
      classes: "large",
    });
    expect(document.querySelector("button.red-amber-green-picker-button.large"))
      .toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("red-amber-green-picker-button", { status: "red" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
