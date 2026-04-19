import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("united-states-social-security-number-view", () => {
  it("renders a <span> with the base class", () => {
    const { document } = render(
      "united-states-social-security-number-view",
      { value: "123456789" },
    );
    expect(document.querySelector(
      "span.united-states-social-security-number-view",
    )).toBeTruthy();
  });

  it("groups 9 raw digits as 'XXX-XX-XXXX'", () => {
    const { document } = render(
      "united-states-social-security-number-view",
      { value: "123456789" },
    );
    expect(document.querySelector("span").textContent.trim())
      .toBe("123-45-6789");
  });

  it("accepts embedded hyphens and regroups", () => {
    const { document } = render(
      "united-states-social-security-number-view",
      { value: "123-45-6789" },
    );
    expect(document.querySelector("span").textContent.trim())
      .toBe("123-45-6789");
  });

  it("accepts embedded spaces and regroups", () => {
    const { document } = render(
      "united-states-social-security-number-view",
      { value: "123 45 6789" },
    );
    expect(document.querySelector("span").textContent.trim())
      .toBe("123-45-6789");
  });

  it("renders non-9-digit values as-is (masked last-4 pattern)", () => {
    const { document } = render(
      "united-states-social-security-number-view",
      { value: "XXX-XX-6789" },
    );
    expect(document.querySelector("span").textContent.trim())
      .toBe("XXX-XX-6789");
  });

  it("sets aria-label from params.label", () => {
    const { document } = render(
      "united-states-social-security-number-view",
      { value: "123456789", label: "SSN" },
    );
    expect(document.querySelector("span").getAttribute("aria-label"))
      .toBe("SSN");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render(
      "united-states-social-security-number-view",
      { value: "123456789" },
    );
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
