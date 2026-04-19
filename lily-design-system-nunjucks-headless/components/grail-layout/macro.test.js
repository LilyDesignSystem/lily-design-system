import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("grail-layout", () => {
  it("renders a <div> with the base class", () => {
    const { document } = render("grail-layout", {});
    expect(document.querySelector("div.grail-layout")).toBeTruthy();
  });

  it("renders caller block content", () => {
    const { document } = render(
      "grail-layout",
      {},
      '<header class="grail-layout-top-header">x</header>',
    );
    expect(document.querySelector("div.grail-layout header")).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("grail-layout", { classes: "narrow" });
    expect(document.querySelector("div.grail-layout.narrow")).toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render("grail-layout", {
      attributes: { "data-page": "home" },
    });
    expect(document.querySelector("div.grail-layout").getAttribute("data-page"))
      .toBe("home");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("grail-layout", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
