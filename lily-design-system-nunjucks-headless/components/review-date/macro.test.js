import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("review-date", () => {
  it("renders a <p> with the reviewed date", () => {
    const { document } = render("review-date", {
      reviewedOn: "2026-04-20",
      reviewedOnText: "20 April 2026",
    });
    const el = document.querySelector("p.review-date");
    expect(el).toBeTruthy();
    const t = el.querySelector(".review-date-reviewed time");
    expect(t.getAttribute("datetime")).toBe("2026-04-20");
    expect(t.textContent.trim()).toBe("20 April 2026");
  });

  it("renders an optional next-review date", () => {
    const { document } = render("review-date", {
      reviewedOn: "2026-04-20",
      nextReviewOn: "2026-10-20",
      nextReviewOnText: "20 October 2026",
    });
    const t = document.querySelector(".review-date-next time");
    expect(t.getAttribute("datetime")).toBe("2026-10-20");
    expect(t.textContent.trim()).toBe("20 October 2026");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("review-date", { reviewedOn: "2026-04-20" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
