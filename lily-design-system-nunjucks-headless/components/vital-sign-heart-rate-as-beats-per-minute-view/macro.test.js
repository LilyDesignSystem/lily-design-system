import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("vital-sign-heart-rate-as-beats-per-minute-view", () => {
  it("renders a <span> with the base class", () => {
    const { document } = render(
      "vital-sign-heart-rate-as-beats-per-minute-view",
      { value: 72 },
    );
    expect(document.querySelector(
      "span.vital-sign-heart-rate-as-beats-per-minute-view",
    )).toBeTruthy();
  });

  it("wraps the value in a .vital-sign-value child", () => {
    const { document } = render(
      "vital-sign-heart-rate-as-beats-per-minute-view",
      { value: 72 },
    );
    const v = document.querySelector(".vital-sign-value");
    expect(v).toBeTruthy();
    expect(v.textContent).toBe("72");
  });

  it("renders the unit in an <abbr> with expanded title", () => {
    const { document } = render(
      "vital-sign-heart-rate-as-beats-per-minute-view",
      { value: 72 },
    );
    const abbr = document.querySelector("abbr.vital-sign-unit");
    expect(abbr).toBeTruthy();
    expect(abbr.getAttribute("title")).toBe("beats per minute");
    expect(abbr.textContent).toBe("bpm");
  });

  it("sets aria-label from params.label", () => {
    const { document } = render(
      "vital-sign-heart-rate-as-beats-per-minute-view",
      { value: 72, label: "Heart rate" },
    );
    expect(document.querySelector("span.vital-sign-heart-rate-as-beats-per-minute-view")
      .getAttribute("aria-label")).toBe("Heart rate");
  });

  it("appends params.classes", () => {
    const { document } = render(
      "vital-sign-heart-rate-as-beats-per-minute-view",
      { value: 72, classes: "abnormal" },
    );
    expect(document.querySelector(
      "span.vital-sign-heart-rate-as-beats-per-minute-view.abnormal",
    )).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render(
      "vital-sign-heart-rate-as-beats-per-minute-view",
      { value: 72 },
    );
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
