import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("action-bar-button", () => {
  it("renders a <button> with the base class and aria-label", () => {
    const { document } = render("action-bar-button", {
      label: "Delete",
      text: "Delete",
    });
    const el = document.querySelector("button.action-bar-button");
    expect(el).toBeTruthy();
    expect(el.getAttribute("aria-label")).toBe("Delete");
  });

  it("defaults type to 'button'", () => {
    const { document } = render("action-bar-button", { label: "Delete" });
    expect(document.querySelector("button").getAttribute("type")).toBe("button");
  });

  it("respects a custom type", () => {
    const { document } = render("action-bar-button", {
      label: "Submit",
      type: "submit",
    });
    expect(document.querySelector("button").getAttribute("type")).toBe("submit");
  });

  it("renders disabled when disabled is true", () => {
    const { document } = render("action-bar-button", {
      label: "Delete",
      disabled: true,
    });
    expect(document.querySelector("button").hasAttribute("disabled"))
      .toBe(true);
  });

  it("renders escaped text content", () => {
    const { document } = render("action-bar-button", {
      label: "Delete",
      text: "Delete",
    });
    expect(document.querySelector("button.action-bar-button").textContent.trim())
      .toBe("Delete");
  });

  it("renders raw html content", () => {
    const { document } = render("action-bar-button", {
      label: "Delete",
      html: "<svg></svg><span>Delete</span>",
    });
    expect(document.querySelector("button.action-bar-button svg")).toBeTruthy();
    expect(document.querySelector("button.action-bar-button span").textContent)
      .toBe("Delete");
  });

  it("appends params.classes", () => {
    const { document } = render("action-bar-button", {
      label: "Delete",
      classes: "danger",
    });
    expect(document.querySelector("button.action-bar-button.danger")).toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render("action-bar-button", {
      label: "Delete",
      attributes: { "data-test": "x" },
    });
    expect(document.querySelector("button").getAttribute("data-test"))
      .toBe("x");
  });

  it("contains no <style> tag", () => {
    const { html } = render("action-bar-button", { label: "Delete" });
    expect(html).not.toContain("<style");
  });
});
