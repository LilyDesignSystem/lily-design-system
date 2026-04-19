import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("grail-layout-bottom-footer", () => {
  it("renders a <footer> with the base class", () => {
    const { document } = render("grail-layout-bottom-footer", {});
    expect(document.querySelector("footer.grail-layout-bottom-footer"))
      .toBeTruthy();
  });

  it("sets aria-label when provided", () => {
    const { document } = render("grail-layout-bottom-footer", {
      label: "Site footer",
    });
    expect(document.querySelector("footer").getAttribute("aria-label"))
      .toBe("Site footer");
  });

  it("appends params.classes", () => {
    const { document } = render("grail-layout-bottom-footer", {
      classes: "slim",
    });
    expect(document.querySelector("footer.grail-layout-bottom-footer.slim"))
      .toBeTruthy();
  });

  it("renders caller block content", () => {
    const { document } = render(
      "grail-layout-bottom-footer",
      {},
      "<p>© 2026</p>",
    );
    expect(document.querySelector("footer p").textContent).toBe("© 2026");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("grail-layout-bottom-footer", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
