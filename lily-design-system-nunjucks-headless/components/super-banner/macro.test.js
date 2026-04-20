import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("super-banner", () => {
  it("renders a <div role=alert> with default level", () => {
    const { document } = render("super-banner", {
      heading: "Service degraded",
      text: "Some features are slower than usual.",
    });
    const el = document.querySelector("div.super-banner");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("alert");
    expect(el.getAttribute("data-level")).toBe("warning");
    expect(document.querySelector(".super-banner-heading").textContent.trim())
      .toBe("Service degraded");
  });

  it("respects level", () => {
    const { document } = render("super-banner", {
      level: "danger",
      text: "x",
    });
    expect(document.querySelector("div").getAttribute("data-level"))
      .toBe("danger");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("super-banner", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
