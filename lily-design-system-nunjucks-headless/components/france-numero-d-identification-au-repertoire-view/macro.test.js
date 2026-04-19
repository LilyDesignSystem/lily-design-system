import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("france-numero-d-identification-au-repertoire-view", () => {
  it("renders a <span> with the base class", () => {
    const { document } = render(
      "france-numero-d-identification-au-repertoire-view",
      { value: "185127846310038" },
    );
    expect(document.querySelector(
      "span.france-numero-d-identification-au-repertoire-view",
    )).toBeTruthy();
  });

  it("groups 15 raw digits as 'G YY MM CC VVV SSS KK'", () => {
    const { document } = render(
      "france-numero-d-identification-au-repertoire-view",
      { value: "185127846310038" },
    );
    expect(document.querySelector("span").textContent.trim())
      .toBe("1 85 12 78 463 100 38");
  });

  it("accepts embedded spaces and regroups", () => {
    const { document } = render(
      "france-numero-d-identification-au-repertoire-view",
      { value: "1 85 12 78 463 100 38" },
    );
    expect(document.querySelector("span").textContent.trim())
      .toBe("1 85 12 78 463 100 38");
  });

  it("accepts Corsica département letter (A or B in positions 6-7)", () => {
    const { document } = render(
      "france-numero-d-identification-au-repertoire-view",
      { value: "1851220A000038" },
    );
    // 14 chars → renders as-is (not 15)
    expect(document.querySelector("span").textContent.trim())
      .toBe("1851220A000038");
  });

  it("renders non-15-character values as-is", () => {
    const { document } = render(
      "france-numero-d-identification-au-repertoire-view",
      { value: "pending" },
    );
    expect(document.querySelector("span").textContent.trim()).toBe("pending");
  });

  it("sets aria-label from params.label", () => {
    const { document } = render(
      "france-numero-d-identification-au-repertoire-view",
      { value: "185127846310038", label: "Numéro INSEE" },
    );
    expect(document.querySelector("span").getAttribute("aria-label"))
      .toBe("Numéro INSEE");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render(
      "france-numero-d-identification-au-repertoire-view",
      { value: "185127846310038" },
    );
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
