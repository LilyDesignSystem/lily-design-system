import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("icon", () => {
  it("renders a <span> with the base class", () => {
    const { document } = render("icon", { html: "<svg></svg>" });
    expect(document.querySelector("span.icon svg")).toBeTruthy();
  });

  it("sets aria-hidden='true' when decorative", () => {
    const { document } = render("icon", {
      decorative: true,
      html: "<svg></svg>",
    });
    const el = document.querySelector("span.icon");
    expect(el.getAttribute("aria-hidden")).toBe("true");
    expect(el.hasAttribute("role")).toBe(false);
  });

  it("sets role='img' and aria-label when label is given", () => {
    const { document } = render("icon", {
      label: "Warning",
      html: "<svg></svg>",
    });
    const el = document.querySelector("span.icon");
    expect(el.getAttribute("role")).toBe("img");
    expect(el.getAttribute("aria-label")).toBe("Warning");
  });

  it("ignores label when decorative is true", () => {
    const { document } = render("icon", {
      decorative: true,
      label: "Ignored",
      html: "<svg></svg>",
    });
    const el = document.querySelector("span.icon");
    expect(el.getAttribute("aria-hidden")).toBe("true");
    expect(el.hasAttribute("aria-label")).toBe(false);
  });

  it("appends params.classes", () => {
    const { document } = render("icon", {
      label: "x",
      html: "<svg></svg>",
      classes: "small",
    });
    expect(document.querySelector("span.icon.small")).toBeTruthy();
  });

  it("renders caller block content", () => {
    const { document } = render("icon", { label: "Close" }, "<svg></svg>");
    expect(document.querySelector("span.icon svg")).toBeTruthy();
  });

  it("contains no <style> tags outside the content", () => {
    const { html } = render("icon", { decorative: true, html: "<svg></svg>" });
    expect(html).not.toContain("style=");
  });
});
