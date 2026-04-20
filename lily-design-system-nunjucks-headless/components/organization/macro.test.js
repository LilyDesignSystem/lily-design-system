import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("organization", () => {
  it("renders a <div role=group> with the org name", () => {
    const { document } = render("organization", {
      name: "NHS England",
      description: "National health service",
    });
    const el = document.querySelector("div.organization");
    expect(el).toBeTruthy();
    expect(el.getAttribute("aria-label")).toBe("NHS England");
    expect(document.querySelector(".organization-name").textContent.trim())
      .toBe("NHS England");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("organization", { name: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
