import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("measurement-instance-view", () => {
  it("renders a <span> with value and unit", () => {
    const { document } = render("measurement-instance-view", {
      value: "75",
      unit: "kg",
      unitLabel: "kilograms",
    });
    const span = document.querySelector("span.measurement-instance-view");
    expect(span).toBeTruthy();
    expect(
      span.querySelector(".measurement-instance-view-value").textContent.trim(),
    ).toBe("75");
    const u = span.querySelector("abbr.measurement-instance-view-unit");
    expect(u.textContent.trim()).toBe("kg");
    expect(u.getAttribute("title")).toBe("kilograms");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("measurement-instance-view", { value: "1", unit: "cm" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
