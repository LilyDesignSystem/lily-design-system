import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("field", () => {
  it("renders a <div> with the base class", () => {
    const { document } = render("field", {});
    const el = document.querySelector("div.field");
    expect(el).toBeTruthy();
  });

  it("defaults data-state to 'valid'", () => {
    const { document } = render("field", {});
    expect(document.querySelector("div.field").getAttribute("data-state"))
      .toBe("valid");
  });

  it("sets data-state to 'invalid' when error is truthy", () => {
    const { document } = render("field", { error: "Please fix this" });
    expect(document.querySelector("div.field").getAttribute("data-state"))
      .toBe("invalid");
  });

  it("sets data-state to 'invalid' when error is boolean true", () => {
    const { document } = render("field", { error: true });
    expect(document.querySelector("div.field").getAttribute("data-state"))
      .toBe("invalid");
  });

  it("appends params.classes", () => {
    const { document } = render("field", { classes: "inline" });
    expect(document.querySelector("div.field.inline")).toBeTruthy();
  });

  it("renders caller block content", () => {
    const { document } = render(
      "field",
      {},
      '<label for="x">Name</label><input id="x">',
    );
    const f = document.querySelector("div.field");
    expect(f.querySelector("label").textContent).toBe("Name");
    expect(f.querySelector("input")).toBeTruthy();
  });

  it("renders params.html raw when no caller", () => {
    const { document } = render("field", { html: "<input>" });
    expect(document.querySelector("div.field input")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("field", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
