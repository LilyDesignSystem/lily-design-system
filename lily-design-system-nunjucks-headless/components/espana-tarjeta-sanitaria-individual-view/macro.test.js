import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("espana-tarjeta-sanitaria-individual-view", () => {
  it("renders a <span> with the base class", () => {
    const { document } = render(
      "espana-tarjeta-sanitaria-individual-view",
      { value: "BBBB090810C003" },
    );
    expect(document.querySelector(
      "span.espana-tarjeta-sanitaria-individual-view",
    )).toBeTruthy();
  });

  it("renders the value as-is (no auto-grouping)", () => {
    const { document } = render(
      "espana-tarjeta-sanitaria-individual-view",
      { value: "BBBB090810C003" },
    );
    expect(document.querySelector("span").textContent.trim())
      .toBe("BBBB090810C003");
  });

  it("renders empty value safely", () => {
    const { document } = render("espana-tarjeta-sanitaria-individual-view", {});
    expect(document.querySelector("span").textContent).toBe("");
  });

  it("sets aria-label from params.label", () => {
    const { document } = render(
      "espana-tarjeta-sanitaria-individual-view",
      { value: "BBBB090810C003", label: "Tarjeta Sanitaria Individual" },
    );
    expect(document.querySelector("span").getAttribute("aria-label"))
      .toBe("Tarjeta Sanitaria Individual");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render(
      "espana-tarjeta-sanitaria-individual-view",
      { value: "BBBB090810C003" },
    );
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
