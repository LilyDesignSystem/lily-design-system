import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("event", () => {
  it("renders an <article> with title, time, and location", () => {
    const { document } = render("event", {
      title: "Consultation",
      time: "2026-04-27T09:30:00Z",
      timeText: "27 April 2026, 9:30am",
      location: "High Street Surgery",
    });
    const el = document.querySelector("article.event");
    expect(el).toBeTruthy();
    expect(el.getAttribute("aria-label")).toBe("Consultation");
    expect(document.querySelector(".event-title").textContent.trim())
      .toBe("Consultation");
    const t = document.querySelector(".event-time");
    expect(t.getAttribute("datetime")).toBe("2026-04-27T09:30:00Z");
    expect(t.textContent.trim()).toBe("27 April 2026, 9:30am");
    expect(document.querySelector(".event-location").textContent.trim())
      .toBe("High Street Surgery");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("event", { title: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
