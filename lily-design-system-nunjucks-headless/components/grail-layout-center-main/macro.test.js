import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("grail-layout-center-main", () => {
  it("renders a <main> with the base class", () => {
    const { document } = render("grail-layout-center-main", {});
    expect(document.querySelector("main.grail-layout-center-main")).toBeTruthy();
  });

  it("sets id for skip-link targeting", () => {
    const { document } = render("grail-layout-center-main", {
      id: "main-content",
    });
    expect(document.querySelector("main").getAttribute("id"))
      .toBe("main-content");
  });

  it("appends params.classes", () => {
    const { document } = render("grail-layout-center-main", {
      classes: "wide",
    });
    expect(document.querySelector("main.grail-layout-center-main.wide"))
      .toBeTruthy();
  });

  it("renders caller block content", () => {
    const { document } = render(
      "grail-layout-center-main",
      {},
      "<h1>Welcome</h1>",
    );
    expect(document.querySelector("main h1").textContent).toBe("Welcome");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("grail-layout-center-main", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
