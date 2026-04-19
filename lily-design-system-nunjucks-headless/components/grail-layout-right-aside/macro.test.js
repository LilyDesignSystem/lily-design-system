import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("grail-layout-right-aside", () => {
  it("renders an <aside> with the base class", () => {
    const { document } = render("grail-layout-right-aside", {});
    expect(document.querySelector("aside.grail-layout-right-aside")).toBeTruthy();
  });

  it("sets aria-label", () => {
    const { document } = render("grail-layout-right-aside", {
      label: "Related content",
    });
    expect(document.querySelector("aside").getAttribute("aria-label"))
      .toBe("Related content");
  });

  it("appends params.classes", () => {
    const { document } = render("grail-layout-right-aside", {
      classes: "narrow",
    });
    expect(document.querySelector("aside.grail-layout-right-aside.narrow"))
      .toBeTruthy();
  });

  it("renders caller block content", () => {
    const { document } = render(
      "grail-layout-right-aside",
      {},
      "<div>Related</div>",
    );
    expect(document.querySelector("aside div").textContent).toBe("Related");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("grail-layout-right-aside", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
