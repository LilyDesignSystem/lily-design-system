import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("overlay-container", () => {
  it("renders a <div> with the base class and presentation role", () => {
    const { document } = render("overlay-container", {});
    const el = document.querySelector("div.overlay-container");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("presentation");
  });

  it("defaults open to false (hidden, aria-hidden='true')", () => {
    const { document } = render("overlay-container", {});
    const el = document.querySelector("div.overlay-container");
    expect(el.getAttribute("data-open")).toBe("false");
    expect(el.getAttribute("aria-hidden")).toBe("true");
    expect(el.hasAttribute("hidden")).toBe(true);
  });

  it("renders open=true with no hidden attribute and aria-hidden='false'", () => {
    const { document } = render("overlay-container", { open: true });
    const el = document.querySelector("div.overlay-container");
    expect(el.getAttribute("data-open")).toBe("true");
    expect(el.getAttribute("aria-hidden")).toBe("false");
    expect(el.hasAttribute("hidden")).toBe(false);
  });

  it("renders caller content", () => {
    const { document } = render(
      "overlay-container",
      { open: true },
      '<div role="dialog">Dialog</div>',
    );
    expect(
      document.querySelector("div.overlay-container [role=dialog]"),
    ).toBeTruthy();
  });

  it("renders aria-label when provided", () => {
    const { document } = render("overlay-container", {
      open: true,
      label: "Modal backdrop",
    });
    expect(
      document.querySelector("div.overlay-container").getAttribute("aria-label"),
    ).toBe("Modal backdrop");
  });

  it("appends params.classes", () => {
    const { document } = render("overlay-container", {
      open: true,
      classes: "fade",
    });
    expect(document.querySelector("div.overlay-container.fade")).toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render("overlay-container", {
      open: true,
      attributes: { "data-test": "x" },
    });
    expect(
      document.querySelector("div.overlay-container").getAttribute("data-test"),
    ).toBe("x");
  });

  it("contains no <style> or <script> tag", () => {
    const { html } = render("overlay-container", { open: true });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
