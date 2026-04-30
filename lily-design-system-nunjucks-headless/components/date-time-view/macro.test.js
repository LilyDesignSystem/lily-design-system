import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("date-time-view", () => {
  it("renders a <time> with the base class and datetime attribute", () => {
    const { document } = render("date-time-view", {
      value: "2026-04-27T15:00:00Z",
    });
    const el = document.querySelector("time.date-time-view");
    expect(el).toBeTruthy();
    expect(el.getAttribute("datetime")).toBe("2026-04-27T15:00:00Z");
  });

  it("falls back to value when no format/text/html is provided", () => {
    const { document } = render("date-time-view", {
      value: "2026-04-27T15:00:00Z",
    });
    expect(document.querySelector("time").textContent.trim())
      .toBe("2026-04-27T15:00:00Z");
  });

  it("renders params.format as display text", () => {
    const { document } = render("date-time-view", {
      value: "2026-04-27T15:00:00Z",
      format: "27 April 2026",
    });
    expect(document.querySelector("time").textContent.trim())
      .toBe("27 April 2026");
  });

  it("params.text overrides format", () => {
    const { document } = render("date-time-view", {
      value: "2026-04-27T15:00:00Z",
      format: "Format",
      text: "Text",
    });
    expect(document.querySelector("time").textContent.trim()).toBe("Text");
  });

  it("renders params.html as raw HTML and overrides text/format", () => {
    const { document } = render("date-time-view", {
      value: "2026-04-27T15:00:00Z",
      html: "<strong>Now</strong>",
    });
    expect(document.querySelector("time strong").textContent).toBe("Now");
  });

  it("renders params.label as aria-label", () => {
    const { document } = render("date-time-view", {
      value: "2026-04-27T15:00:00Z",
      label: "Published",
    });
    expect(document.querySelector("time").getAttribute("aria-label"))
      .toBe("Published");
  });

  it("appends params.classes", () => {
    const { document } = render("date-time-view", {
      value: "2026-04-27T15:00:00Z",
      classes: "muted",
    });
    expect(document.querySelector("time.date-time-view.muted")).toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render("date-time-view", {
      value: "2026-04-27T15:00:00Z",
      attributes: { "data-test": "x" },
    });
    expect(document.querySelector("time").getAttribute("data-test")).toBe("x");
  });

  it("contains no <style> or <script> tag", () => {
    const { html } = render("date-time-view", {
      value: "2026-04-27T15:00:00Z",
    });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
