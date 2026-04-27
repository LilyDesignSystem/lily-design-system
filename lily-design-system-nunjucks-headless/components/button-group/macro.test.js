import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("button-group", () => {
  it("renders a <div> with the base class and role='group'", () => {
    const { document } = render("button-group", { label: "Actions" });
    const el = document.querySelector("div.button-group");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("group");
  });

  it("renders aria-label", () => {
    const { document } = render("button-group", { label: "Form actions" });
    expect(document.querySelector("div.button-group").getAttribute("aria-label"))
      .toBe("Form actions");
  });

  it("renders caller block content", () => {
    const { document } = render(
      "button-group",
      { label: "Actions" },
      "<button type='submit'>Save</button><button type='button'>Cancel</button>",
    );
    expect(document.querySelectorAll("div.button-group button").length).toBe(2);
  });

  it("renders raw html via params.html", () => {
    const { document } = render("button-group", {
      label: "Actions",
      html: "<button>One</button>",
    });
    expect(document.querySelector("div.button-group button")).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("button-group", {
      label: "Actions",
      classes: "stacked",
    });
    expect(document.querySelector("div.button-group.stacked")).toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render("button-group", {
      label: "Actions",
      attributes: { "data-test": "x" },
    });
    expect(document.querySelector("div.button-group").getAttribute("data-test"))
      .toBe("x");
  });

  it("contains no <style> tag", () => {
    const { html } = render("button-group", { label: "Actions" });
    expect(html).not.toContain("<style");
  });
});
