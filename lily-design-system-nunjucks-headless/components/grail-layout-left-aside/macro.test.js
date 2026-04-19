import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("grail-layout-left-aside", () => {
  it("renders an <aside> with the base class", () => {
    const { document } = render("grail-layout-left-aside", {});
    expect(document.querySelector("aside.grail-layout-left-aside")).toBeTruthy();
  });

  it("sets aria-label", () => {
    const { document } = render("grail-layout-left-aside", {
      label: "Navigation",
    });
    expect(document.querySelector("aside").getAttribute("aria-label"))
      .toBe("Navigation");
  });

  it("appends params.classes", () => {
    const { document } = render("grail-layout-left-aside", {
      classes: "narrow",
    });
    expect(document.querySelector("aside.grail-layout-left-aside.narrow"))
      .toBeTruthy();
  });

  it("renders caller block content", () => {
    const { document } = render(
      "grail-layout-left-aside",
      {},
      "<nav>Left nav</nav>",
    );
    expect(document.querySelector("aside nav").textContent).toBe("Left nav");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("grail-layout-left-aside", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
