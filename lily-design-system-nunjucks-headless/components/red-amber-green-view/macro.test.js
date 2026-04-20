import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("red-amber-green-view", () => {
  it("renders a <span> with the base class and default data-status", () => {
    const { document } = render("red-amber-green-view", {});
    const el = document.querySelector("span.red-amber-green-view");
    expect(el).toBeTruthy();
    expect(el.getAttribute("data-status")).toBe("unknown");
  });

  it("sets data-status from params.status", () => {
    const { document } = render("red-amber-green-view", { status: "amber" });
    expect(document.querySelector("span.red-amber-green-view").getAttribute("data-status"))
      .toBe("amber");
  });

  it("uses status name as default text", () => {
    const { document } = render("red-amber-green-view", { status: "red" });
    expect(document.querySelector(".red-amber-green-view-text").textContent.trim())
      .toBe("Red");
  });

  it("respects a custom text", () => {
    const { document } = render("red-amber-green-view", {
      status: "amber",
      text: "Needs attention",
    });
    expect(document.querySelector(".red-amber-green-view-text").textContent.trim())
      .toBe("Needs attention");
  });

  it("renders the indicator as aria-hidden", () => {
    const { document } = render("red-amber-green-view", { status: "green" });
    expect(
      document.querySelector(".red-amber-green-view-indicator").getAttribute("aria-hidden"),
    ).toBe("true");
  });

  it("appends params.classes", () => {
    const { document } = render("red-amber-green-view", {
      status: "red",
      classes: "pill",
    });
    expect(document.querySelector("span.red-amber-green-view.pill")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("red-amber-green-view", { status: "green" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
