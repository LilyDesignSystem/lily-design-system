import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("timer", () => {
  it("renders an <output> with aria-live and defaults", () => {
    const { document } = render("timer", { text: "05:00" });
    const el = document.querySelector("output.timer");
    expect(el).toBeTruthy();
    expect(el.getAttribute("aria-live")).toBe("polite");
    expect(el.getAttribute("data-mode")).toBe("countdown");
    expect(el.textContent.trim()).toBe("05:00");
  });

  it("supports elapsed mode and duration data attributes", () => {
    const { document } = render("timer", {
      mode: "elapsed",
      duration: 300,
      start: "2026-04-20T09:00:00Z",
    });
    const el = document.querySelector("output");
    expect(el.getAttribute("data-mode")).toBe("elapsed");
    expect(el.getAttribute("data-duration")).toBe("300");
    expect(el.getAttribute("data-start")).toBe("2026-04-20T09:00:00Z");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("timer", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
