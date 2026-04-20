import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("red-orange-yellow-green-blue-view", () => {
  it("renders a <span> with the base class and default data-status", () => {
    const { document } = render("red-orange-yellow-green-blue-view", {});
    const el = document.querySelector("span.red-orange-yellow-green-blue-view");
    expect(el).toBeTruthy();
    expect(el.getAttribute("data-status")).toBe("unknown");
  });

  it("sets data-status from params.status", () => {
    const { document } = render("red-orange-yellow-green-blue-view", {
      status: "yellow",
    });
    expect(
      document
        .querySelector("span.red-orange-yellow-green-blue-view")
        .getAttribute("data-status"),
    ).toBe("yellow");
  });

  it("uses status name as default text for each level", () => {
    for (const status of ["red", "orange", "yellow", "green", "blue"]) {
      const { document } = render("red-orange-yellow-green-blue-view", { status });
      const expected = status[0].toUpperCase() + status.slice(1);
      expect(
        document
          .querySelector(".red-orange-yellow-green-blue-view-text")
          .textContent.trim(),
      ).toBe(expected);
    }
  });

  it("respects a custom text", () => {
    const { document } = render("red-orange-yellow-green-blue-view", {
      status: "yellow",
      text: "Warning",
    });
    expect(
      document.querySelector(".red-orange-yellow-green-blue-view-text").textContent.trim(),
    ).toBe("Warning");
  });

  it("renders the indicator as aria-hidden", () => {
    const { document } = render("red-orange-yellow-green-blue-view", {
      status: "green",
    });
    expect(
      document
        .querySelector(".red-orange-yellow-green-blue-view-indicator")
        .getAttribute("aria-hidden"),
    ).toBe("true");
  });

  it("appends params.classes", () => {
    const { document } = render("red-orange-yellow-green-blue-view", {
      status: "blue",
      classes: "pill",
    });
    expect(
      document.querySelector("span.red-orange-yellow-green-blue-view.pill"),
    ).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("red-orange-yellow-green-blue-view", { status: "green" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
