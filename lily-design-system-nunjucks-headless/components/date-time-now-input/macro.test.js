import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("date-time-now-input", () => {
  it("renders date, time, and now button", () => {
    const { document } = render("date-time-now-input", {
      id: "dt",
      name: "dt",
      date: "2026-04-20",
      time: "09:30",
    });
    expect(document.querySelector(".date-time-now-input-date").getAttribute("value"))
      .toBe("2026-04-20");
    expect(document.querySelector(".date-time-now-input-time").getAttribute("value"))
      .toBe("09:30");
    expect(document.querySelector(".date-time-now-input-now").textContent.trim())
      .toBe("Now");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("date-time-now-input", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
