import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("medical-banner", () => {
  it("renders a <div role=region> with the base class", () => {
    const { document } = render("medical-banner", {});
    const el = document.querySelector("div.medical-banner");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("region");
  });

  it("defaults aria-label to 'Patient banner'", () => {
    const { document } = render("medical-banner", {});
    expect(document.querySelector("div.medical-banner").getAttribute("aria-label"))
      .toBe("Patient banner");
  });

  it("respects a custom label", () => {
    const { document } = render("medical-banner", {
      label: "Patient banner for Jane Smith",
    });
    expect(document.querySelector("div.medical-banner").getAttribute("aria-label"))
      .toBe("Patient banner for Jane Smith");
  });

  it("uses aria-labelledby when provided", () => {
    const { document } = render("medical-banner", { labelledBy: "h" });
    const el = document.querySelector("div.medical-banner");
    expect(el.getAttribute("aria-labelledby")).toBe("h");
    expect(el.hasAttribute("aria-label")).toBe(false);
  });

  it("renders caller block content", () => {
    const { document } = render(
      "medical-banner",
      {},
      '<div class="medical-banner-box">Patient</div>',
    );
    expect(document.querySelector("div.medical-banner .medical-banner-box"))
      .toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("medical-banner", { classes: "compact" });
    expect(document.querySelector("div.medical-banner.compact")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("medical-banner", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
