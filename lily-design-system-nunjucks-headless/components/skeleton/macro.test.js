import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("skeleton", () => {
  it("renders a <div> with the base class and data-shape='line'", () => {
    const { document } = render("skeleton", {});
    const el = document.querySelector("div.skeleton");
    expect(el).toBeTruthy();
    expect(el.getAttribute("data-shape")).toBe("line");
    expect(el.getAttribute("aria-hidden")).toBe("true");
  });

  it("respects custom shape", () => {
    const { document } = render("skeleton", { shape: "circle" });
    expect(document.querySelector("div.skeleton").getAttribute("data-shape"))
      .toBe("circle");
  });

  it("renders multiple skeletons when count > 1", () => {
    const { document } = render("skeleton", { count: 3 });
    expect(document.querySelectorAll("div.skeleton").length).toBe(3);
  });

  it("renders the id only on the first skeleton in a count", () => {
    const { document } = render("skeleton", { count: 3, id: "first" });
    const els = document.querySelectorAll("div.skeleton");
    expect(els[0].getAttribute("id")).toBe("first");
    expect(els[1].hasAttribute("id")).toBe(false);
    expect(els[2].hasAttribute("id")).toBe(false);
  });

  it("emits inline CSS custom properties for width and height", () => {
    const { document } = render("skeleton", {
      shape: "block",
      width: "3rem",
      height: "3rem",
    });
    const style = document.querySelector("div.skeleton").getAttribute("style");
    expect(style).toContain("--skeleton-width:3rem");
    expect(style).toContain("--skeleton-height:3rem");
  });

  it("appends params.classes", () => {
    const { document } = render("skeleton", { classes: "light" });
    expect(document.querySelector("div.skeleton.light")).toBeTruthy();
  });

  it("is aria-hidden because it is a purely visual placeholder", () => {
    const { document } = render("skeleton", {});
    expect(document.querySelector("div.skeleton").getAttribute("aria-hidden"))
      .toBe("true");
  });
});
