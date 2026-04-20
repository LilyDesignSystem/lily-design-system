import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("timeline-list-item", () => {
  it("renders an <li> with the base class", () => {
    const { document } = render("timeline-list-item", { heading: "E" });
    expect(document.querySelector("li.timeline-list-item")).toBeTruthy();
  });

  it("renders a <time> with datetime when time is provided", () => {
    const { document } = render("timeline-list-item", {
      time: "2026-04-20",
      timeText: "20 Apr 2026",
      heading: "x",
    });
    const t = document.querySelector("time.timeline-list-item-time");
    expect(t.getAttribute("datetime")).toBe("2026-04-20");
    expect(t.textContent.trim()).toBe("20 Apr 2026");
  });

  it("renders the heading when provided", () => {
    const { document } = render("timeline-list-item", { heading: "Event" });
    expect(
      document.querySelector(".timeline-list-item-heading").textContent.trim(),
    ).toBe("Event");
  });

  it("renders the text body", () => {
    const { document } = render("timeline-list-item", {
      heading: "x",
      text: "Body",
    });
    expect(
      document.querySelector(".timeline-list-item-body").textContent.trim(),
    ).toBe("Body");
  });

  it("renders html body raw", () => {
    const { document } = render("timeline-list-item", {
      heading: "x",
      html: "<p>Body</p>",
    });
    expect(
      document.querySelector(".timeline-list-item-body p").textContent,
    ).toBe("Body");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("timeline-list-item", { heading: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
