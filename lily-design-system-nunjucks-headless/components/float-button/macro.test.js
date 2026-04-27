import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("float-button", () => {
  it("renders a <button> with the base class and aria-label", () => {
    const { document } = render("float-button", {
      label: "Compose",
      html: "<svg></svg>",
    });
    const el = document.querySelector("button.float-button");
    expect(el).toBeTruthy();
    expect(el.getAttribute("aria-label")).toBe("Compose");
  });

  it("defaults type to 'button'", () => {
    const { document } = render("float-button", { label: "X" });
    expect(document.querySelector("button").getAttribute("type")).toBe("button");
  });

  it("defaults position to bottom-right", () => {
    const { document } = render("float-button", { label: "X" });
    const el = document.querySelector("button.float-button");
    expect(el.getAttribute("data-position")).toBe("bottom-right");
    expect(el.getAttribute("style")).toContain("position: fixed");
    expect(el.getAttribute("style")).toContain("bottom: 1rem");
    expect(el.getAttribute("style")).toContain("right: 1rem");
  });

  it("supports top-left position", () => {
    const { document } = render("float-button", {
      label: "X",
      position: "top-left",
    });
    const el = document.querySelector("button.float-button");
    expect(el.getAttribute("data-position")).toBe("top-left");
    expect(el.getAttribute("style")).toContain("top: 1rem");
    expect(el.getAttribute("style")).toContain("left: 1rem");
  });

  it("supports top-right position", () => {
    const { document } = render("float-button", {
      label: "X",
      position: "top-right",
    });
    expect(document.querySelector("button").getAttribute("style"))
      .toContain("top: 1rem");
  });

  it("supports bottom-left position", () => {
    const { document } = render("float-button", {
      label: "X",
      position: "bottom-left",
    });
    expect(document.querySelector("button").getAttribute("style"))
      .toContain("left: 1rem");
  });

  it("renders disabled when disabled is true", () => {
    const { document } = render("float-button", {
      label: "X",
      disabled: true,
    });
    expect(document.querySelector("button").hasAttribute("disabled"))
      .toBe(true);
  });

  it("renders icon HTML inside the button", () => {
    const { document } = render("float-button", {
      label: "X",
      html: "<svg class='icon'></svg>",
    });
    expect(document.querySelector("button.float-button svg.icon")).toBeTruthy();
  });

  it("renders caller content", () => {
    const { document } = render(
      "float-button",
      { label: "Star" },
      "<em>★</em>",
    );
    expect(document.querySelector("button.float-button em").textContent)
      .toBe("★");
  });

  it("appends params.classes", () => {
    const { document } = render("float-button", {
      label: "X",
      classes: "extra",
    });
    expect(document.querySelector("button.float-button.extra")).toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render("float-button", {
      label: "X",
      attributes: { "data-test": "y" },
    });
    expect(document.querySelector("button").getAttribute("data-test"))
      .toBe("y");
  });

  it("contains no <style> tag", () => {
    const { html } = render("float-button", { label: "X" });
    expect(html).not.toContain("<style");
  });
});
