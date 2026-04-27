import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("icon-button", () => {
  it("renders a <button> with the base class and aria-label", () => {
    const { document } = render("icon-button", {
      label: "Close",
      html: "<svg></svg>",
    });
    const el = document.querySelector("button.icon-button");
    expect(el).toBeTruthy();
    expect(el.getAttribute("aria-label")).toBe("Close");
  });

  it("defaults type to 'button'", () => {
    const { document } = render("icon-button", { label: "X" });
    expect(document.querySelector("button").getAttribute("type")).toBe("button");
  });

  it("respects a custom type", () => {
    const { document } = render("icon-button", {
      label: "Submit",
      type: "submit",
    });
    expect(document.querySelector("button").getAttribute("type")).toBe("submit");
  });

  it("renders the icon HTML inside the button", () => {
    const { document } = render("icon-button", {
      label: "Close",
      html: "<svg><title>x</title></svg>",
    });
    expect(document.querySelector("button.icon-button svg")).toBeTruthy();
  });

  it("renders disabled when disabled is true", () => {
    const { document } = render("icon-button", {
      label: "Close",
      disabled: true,
    });
    expect(document.querySelector("button").hasAttribute("disabled"))
      .toBe(true);
  });

  it("renders aria-pressed='true' when pressed is true", () => {
    const { document } = render("icon-button", {
      label: "Bold",
      pressed: true,
    });
    expect(document.querySelector("button").getAttribute("aria-pressed"))
      .toBe("true");
  });

  it("renders aria-pressed='false' when pressed is false", () => {
    const { document } = render("icon-button", {
      label: "Bold",
      pressed: false,
    });
    expect(document.querySelector("button").getAttribute("aria-pressed"))
      .toBe("false");
  });

  it("omits aria-pressed when pressed is not provided", () => {
    const { document } = render("icon-button", { label: "Close" });
    expect(document.querySelector("button").hasAttribute("aria-pressed"))
      .toBe(false);
  });

  it("renders caller block content", () => {
    const { document } = render(
      "icon-button",
      { label: "Star" },
      "<em>★</em>",
    );
    expect(document.querySelector("button.icon-button em").textContent)
      .toBe("★");
  });

  it("appends params.classes", () => {
    const { document } = render("icon-button", {
      label: "Close",
      classes: "small",
    });
    expect(document.querySelector("button.icon-button.small")).toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render("icon-button", {
      label: "Close",
      attributes: { "data-test": "x" },
    });
    expect(document.querySelector("button").getAttribute("data-test"))
      .toBe("x");
  });

  it("contains no <style> tag", () => {
    const { html } = render("icon-button", { label: "Close" });
    expect(html).not.toContain("<style");
  });
});
