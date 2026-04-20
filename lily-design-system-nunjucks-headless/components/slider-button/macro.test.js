import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("slider-button", () => {
  it("renders a <div role=button> with default label", () => {
    const { document } = render("slider-button", {});
    const el = document.querySelector("div.slider-button");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("button");
    expect(el.getAttribute("aria-label")).toBe("Slide to confirm");
    expect(el.getAttribute("tabindex")).toBe("0");
  });

  it("respects custom labels and aria-disabled", () => {
    const { document } = render("slider-button", {
      label: "Slide to delete",
      confirmedLabel: "Deleted",
      disabled: true,
    });
    const el = document.querySelector("div");
    expect(el.getAttribute("aria-label")).toBe("Slide to delete");
    expect(el.getAttribute("data-confirmed-label")).toBe("Deleted");
    expect(el.getAttribute("aria-disabled")).toBe("true");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("slider-button", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
