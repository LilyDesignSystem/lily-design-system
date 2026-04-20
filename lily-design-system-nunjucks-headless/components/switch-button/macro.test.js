import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("switch-button", () => {
  it("renders a <button role=switch> with the base class", () => {
    const { document } = render("switch-button", {
      id: "sw",
      label: "Notifications",
    });
    const el = document.querySelector("button.switch-button");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("switch");
    expect(el.getAttribute("aria-label")).toBe("Notifications");
  });

  it("defaults aria-checked='false'", () => {
    const { document } = render("switch-button", { label: "x" });
    expect(document.querySelector("button.switch-button").getAttribute("aria-checked"))
      .toBe("false");
  });

  it("sets aria-checked='true' when checked", () => {
    const { document } = render("switch-button", {
      label: "x",
      checked: true,
    });
    expect(document.querySelector("button.switch-button").getAttribute("aria-checked"))
      .toBe("true");
  });

  it("supports disabled", () => {
    const { document } = render("switch-button", {
      label: "x",
      disabled: true,
    });
    expect(document.querySelector("button.switch-button").hasAttribute("disabled"))
      .toBe(true);
  });

  it("appends params.classes", () => {
    const { document } = render("switch-button", {
      label: "x",
      classes: "large",
    });
    expect(document.querySelector("button.switch-button.large")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("switch-button", { label: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
