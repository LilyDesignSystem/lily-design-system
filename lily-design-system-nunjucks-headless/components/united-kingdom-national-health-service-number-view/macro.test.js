import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("united-kingdom-national-health-service-number-view", () => {
  it("renders a <span> with the base class", () => {
    const { document } = render(
      "united-kingdom-national-health-service-number-view",
      { value: "4857773456" },
    );
    const el = document.querySelector(
      "span.united-kingdom-national-health-service-number-view",
    );
    expect(el).toBeTruthy();
  });

  it("groups a 10-digit raw value as 'XXX XXX XXXX'", () => {
    const { document } = render(
      "united-kingdom-national-health-service-number-view",
      { value: "4857773456" },
    );
    expect(document.querySelector("span").textContent.trim())
      .toBe("485 777 3456");
  });

  it("groups a value with embedded spaces correctly", () => {
    const { document } = render(
      "united-kingdom-national-health-service-number-view",
      { value: "485 777 3456" },
    );
    expect(document.querySelector("span").textContent.trim())
      .toBe("485 777 3456");
  });

  it("groups a value with embedded hyphens correctly", () => {
    const { document } = render(
      "united-kingdom-national-health-service-number-view",
      { value: "485-777-3456" },
    );
    expect(document.querySelector("span").textContent.trim())
      .toBe("485 777 3456");
  });

  it("renders a non-10-digit value as-is", () => {
    const { document } = render(
      "united-kingdom-national-health-service-number-view",
      { value: "not-a-number" },
    );
    expect(document.querySelector("span").textContent.trim())
      .toBe("not-a-number");
  });

  it("renders empty string when value is missing", () => {
    const { document } = render(
      "united-kingdom-national-health-service-number-view",
      {},
    );
    expect(document.querySelector("span").textContent.trim()).toBe("");
  });

  it("sets aria-label from params.label", () => {
    const { document } = render(
      "united-kingdom-national-health-service-number-view",
      { value: "4857773456", label: "NHS number" },
    );
    expect(document.querySelector("span").getAttribute("aria-label"))
      .toBe("NHS number");
  });

  it("appends params.classes", () => {
    const { document } = render(
      "united-kingdom-national-health-service-number-view",
      { value: "4857773456", classes: "large" },
    );
    expect(document.querySelector(
      "span.united-kingdom-national-health-service-number-view.large",
    )).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render(
      "united-kingdom-national-health-service-number-view",
      { value: "4857773456" },
    );
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
