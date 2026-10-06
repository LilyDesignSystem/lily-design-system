import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("review-date", () => {
  it("renders a <time> with datetime, label and text", () => {
    const { document } = render("review-date", {
      datetime: "2026-04-20",
      text: "20 April 2026",
      label: "Last reviewed",
    });
    const el = document.querySelector("time.review-date");
    expect(el).toBeTruthy();
    expect(el.getAttribute("datetime")).toBe("2026-04-20");
    expect(el.getAttribute("aria-label")).toBe("Last reviewed");
    expect(el.textContent.trim()).toBe("20 April 2026");
  });

  it("falls back to the datetime as text and omits unset attributes", () => {
    const { document } = render("review-date", { datetime: "2026-10-20" });
    const el = document.querySelector("time");
    expect(el.textContent.trim()).toBe("2026-10-20");
    expect(el.hasAttribute("aria-label")).toBe(false);
  });

  it("emits id, classes and attributes when given", () => {
    const { document } = render("review-date", { id: "r", classes: "x", attributes: { "data-k": "v" } });
    const el = document.querySelector("time");
    expect(el.id).toBe("r");
    expect(el.classList.contains("x")).toBe(true);
    expect(el.getAttribute("data-k")).toBe("v");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("review-date", { datetime: "2026-04-20" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
