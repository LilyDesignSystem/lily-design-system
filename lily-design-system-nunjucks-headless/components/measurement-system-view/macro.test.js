import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("measurement-system-view", () => {
  it("renders a <span> with data-system and text", () => {
    const { document } = render("measurement-system-view", {
      system: "metric",
      text: "Metric",
    });
    const el = document.querySelector("span.measurement-system-view");
    expect(el).toBeTruthy();
    expect(el.getAttribute("data-system")).toBe("metric");
    expect(el.textContent.trim()).toBe("Metric");
  });

  it("defaults text to the system identifier", () => {
    const { document } = render("measurement-system-view", { system: "imperial" });
    expect(document.querySelector("span").textContent.trim()).toBe("imperial");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("measurement-system-view", { system: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
