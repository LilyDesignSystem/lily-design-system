import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("input-group", () => {
  it("renders a <div role='group'> with the base class", () => {
    const { document } = render("input-group", {});
    const el = document.querySelector("div.input-group");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("group");
  });

  it("renders aria-label when label is provided", () => {
    const { document } = render("input-group", { label: "Price" });
    expect(
      document.querySelector("div.input-group").getAttribute("aria-label"),
    ).toBe("Price");
  });

  it("renders prefix in a <span class='input-group-prefix'>", () => {
    const { document } = render("input-group", { prefix: "$" });
    const prefix = document.querySelector(".input-group-prefix");
    expect(prefix).toBeTruthy();
    expect(prefix.textContent).toBe("$");
  });

  it("renders suffix in a <span class='input-group-suffix'>", () => {
    const { document } = render("input-group", { suffix: ".00" });
    const suffix = document.querySelector(".input-group-suffix");
    expect(suffix).toBeTruthy();
    expect(suffix.textContent).toBe(".00");
  });

  it("renders caller block content as the input slot", () => {
    const { document } = render(
      "input-group",
      { prefix: "$", suffix: ".00" },
      '<input type="number" id="price">',
    );
    expect(document.querySelector("div.input-group input#price"))
      .toBeTruthy();
  });

  it("orders prefix, body, suffix correctly", () => {
    const { html } = render(
      "input-group",
      { prefix: "PRE", suffix: "SUF" },
      '<input id="x">',
    );
    const preIndex = html.indexOf("PRE");
    const inputIndex = html.indexOf('id="x"');
    const sufIndex = html.indexOf("SUF");
    expect(preIndex).toBeGreaterThan(-1);
    expect(inputIndex).toBeGreaterThan(preIndex);
    expect(sufIndex).toBeGreaterThan(inputIndex);
  });

  it("appends params.classes", () => {
    const { document } = render("input-group", { classes: "wide" });
    expect(document.querySelector("div.input-group.wide")).toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render("input-group", {
      attributes: { "data-test": "x" },
    });
    expect(document.querySelector("div.input-group").getAttribute("data-test"))
      .toBe("x");
  });

  it("contains no <style> tag", () => {
    const { html } = render("input-group", {});
    expect(html).not.toContain("<style");
  });
});
