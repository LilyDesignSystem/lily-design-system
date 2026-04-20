import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("date-range", () => {
  it("renders a <span> with two <time> elements and a separator", () => {
    const { document } = render("date-range", {
      start: "2026-04-01",
      startText: "1 April 2026",
      end: "2026-04-30",
      endText: "30 April 2026",
    });
    const s = document.querySelector(".date-range-start");
    const sep = document.querySelector(".date-range-separator");
    const e = document.querySelector(".date-range-end");
    expect(s.getAttribute("datetime")).toBe("2026-04-01");
    expect(s.textContent.trim()).toBe("1 April 2026");
    expect(sep.textContent.trim()).toBe("–");
    expect(e.getAttribute("datetime")).toBe("2026-04-30");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("date-range", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
