import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("postal-code-view", () => {
  it("renders a <span> with the base class", () => {
    const { document } = render("postal-code-view", { value: "SW1A 1AA" });
    const el = document.querySelector("span.postal-code-view");
    expect(el).toBeTruthy();
    expect(el.textContent.trim()).toBe("SW1A 1AA");
  });

  it("renders empty value safely", () => {
    const { document } = render("postal-code-view", {});
    expect(document.querySelector("span.postal-code-view").textContent).toBe("");
  });

  it("escapes special characters", () => {
    const { document } = render("postal-code-view", { value: "<X>" });
    expect(document.querySelector("span").textContent.trim()).toBe("<X>");
  });

  it("sets aria-label from params.label", () => {
    const { document } = render("postal-code-view", {
      value: "SW1A 1AA",
      label: "Postcode",
    });
    expect(document.querySelector("span").getAttribute("aria-label"))
      .toBe("Postcode");
  });

  it("appends params.classes", () => {
    const { document } = render("postal-code-view", {
      value: "SW1A 1AA",
      classes: "strong",
    });
    expect(document.querySelector("span.postal-code-view.strong")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("postal-code-view", { value: "SW1A 1AA" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
