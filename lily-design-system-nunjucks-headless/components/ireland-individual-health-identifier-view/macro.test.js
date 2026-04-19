import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("ireland-individual-health-identifier-view", () => {
  it("renders a <span> with the base class", () => {
    const { document } = render(
      "ireland-individual-health-identifier-view",
      { value: "1234567" },
    );
    expect(document.querySelector(
      "span.ireland-individual-health-identifier-view",
    )).toBeTruthy();
  });

  it("groups 7 raw digits as 'XXXX XXX'", () => {
    const { document } = render(
      "ireland-individual-health-identifier-view",
      { value: "1234567" },
    );
    expect(document.querySelector("span").textContent.trim())
      .toBe("1234 567");
  });

  it("accepts embedded hyphens and regroups", () => {
    const { document } = render(
      "ireland-individual-health-identifier-view",
      { value: "1234-567" },
    );
    expect(document.querySelector("span").textContent.trim())
      .toBe("1234 567");
  });

  it("renders non-7-digit values as-is", () => {
    const { document } = render(
      "ireland-individual-health-identifier-view",
      { value: "pending" },
    );
    expect(document.querySelector("span").textContent.trim()).toBe("pending");
  });

  it("sets aria-label from params.label", () => {
    const { document } = render(
      "ireland-individual-health-identifier-view",
      { value: "1234567", label: "IHI" },
    );
    expect(document.querySelector("span").getAttribute("aria-label"))
      .toBe("IHI");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render(
      "ireland-individual-health-identifier-view",
      { value: "1234567" },
    );
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
