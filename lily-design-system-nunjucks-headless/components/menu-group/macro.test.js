import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("menu-group", () => {
  it("renders a <div role=group> with the base class and aria-label", () => {
    const { document } = render("menu-group", {
      label: "View",
    });
    const el = document.querySelector("div.menu-group");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("group");
    expect(el.getAttribute("aria-label")).toBe("View");
  });

  it("renders the visible heading marked aria-hidden", () => {
    const { document } = render("menu-group", {
      label: "View",
    });
    const heading = document.querySelector(".menu-group-heading");
    expect(heading).toBeTruthy();
    expect(heading.textContent).toBe("View");
    expect(heading.getAttribute("aria-hidden")).toBe("true");
  });

  it("renders raw html children", () => {
    const { document } = render("menu-group", {
      label: "View",
      html: '<div role="menuitem" class="zoom-in">Zoom in</div>',
    });
    expect(document.querySelector(".menu-group .zoom-in")).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("menu-group", {
      label: "View",
      classes: "extra",
    });
    expect(document.querySelector("div.menu-group.extra")).toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render("menu-group", {
      label: "View",
      attributes: { "data-test": "x" },
    });
    expect(document.querySelector("div.menu-group").getAttribute("data-test"))
      .toBe("x");
  });

  it("contains no <style> tag", () => {
    const { html } = render("menu-group", { label: "View" });
    expect(html).not.toContain("<style");
  });
});
