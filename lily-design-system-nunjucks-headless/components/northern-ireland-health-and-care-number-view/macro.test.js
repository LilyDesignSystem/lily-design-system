import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("northern-ireland-health-and-care-number-view", () => {
  it("renders a <span> with the base class", () => {
    const { document } = render(
      "northern-ireland-health-and-care-number-view",
      { value: "4857773456" },
    );
    expect(document.querySelector(
      "span.northern-ireland-health-and-care-number-view",
    )).toBeTruthy();
  });

  it("groups 10 raw digits as 'XXX XXX XXXX'", () => {
    const { document } = render(
      "northern-ireland-health-and-care-number-view",
      { value: "4857773456" },
    );
    expect(document.querySelector("span").textContent.trim())
      .toBe("485 777 3456");
  });

  it("accepts embedded hyphens and regroups", () => {
    const { document } = render(
      "northern-ireland-health-and-care-number-view",
      { value: "485-777-3456" },
    );
    expect(document.querySelector("span").textContent.trim())
      .toBe("485 777 3456");
  });

  it("renders non-10-digit values as-is", () => {
    const { document } = render(
      "northern-ireland-health-and-care-number-view",
      { value: "pending" },
    );
    expect(document.querySelector("span").textContent.trim()).toBe("pending");
  });

  it("sets aria-label from params.label", () => {
    const { document } = render(
      "northern-ireland-health-and-care-number-view",
      { value: "4857773456", label: "H&C number" },
    );
    expect(document.querySelector("span").getAttribute("aria-label"))
      .toBe("H&C number");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render(
      "northern-ireland-health-and-care-number-view",
      { value: "4857773456" },
    );
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
