import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("notification", () => {
  it("renders a <div> with the base class", () => {
    const { document } = render("notification", { text: "Hello" });
    const el = document.querySelector("div.notification");
    expect(el).toBeTruthy();
  });

  it("defaults data-variant to 'default'", () => {
    const { document } = render("notification", { text: "x" });
    expect(document.querySelector("div.notification").getAttribute("data-variant"))
      .toBe("default");
  });

  it("accepts success variant", () => {
    const { document } = render("notification", { text: "x", variant: "success" });
    expect(document.querySelector("div.notification").getAttribute("data-variant"))
      .toBe("success");
  });

  it("defaults role to 'region' when a heading is provided", () => {
    const { document } = render("notification", {
      heading: "Important",
      text: "x",
    });
    const div = document.querySelector("div.notification");
    expect(div.getAttribute("role")).toBe("region");
    expect(div.hasAttribute("aria-labelledby")).toBe(true);
  });

  it("defaults role to 'status' when no heading is provided", () => {
    const { document } = render("notification", { text: "x" });
    expect(document.querySelector("div.notification").getAttribute("role"))
      .toBe("status");
  });

  it("respects a custom role", () => {
    const { document } = render("notification", {
      heading: "x",
      text: "y",
      role: "alert",
    });
    expect(document.querySelector("div.notification").getAttribute("role"))
      .toBe("alert");
  });

  it("renders heading with matching aria-labelledby target", () => {
    const { document } = render("notification", {
      id: "n-1",
      heading: "Important",
      text: "x",
    });
    const div = document.querySelector("div.notification");
    const h = document.querySelector("div.notification h3.notification-title");
    expect(h).toBeTruthy();
    expect(h.getAttribute("id")).toBe("n-1-title");
    expect(div.getAttribute("aria-labelledby")).toBe("n-1-title");
  });

  it("respects a custom heading level", () => {
    const { document } = render("notification", {
      heading: "x",
      headingLevel: 2,
      text: "y",
    });
    expect(document.querySelector("div.notification h2.notification-title"))
      .toBeTruthy();
  });

  it("wraps params.text in <p> inside .notification-content", () => {
    const { document } = render("notification", { text: "Hello" });
    const p = document.querySelector("div.notification .notification-content p");
    expect(p).toBeTruthy();
    expect(p.textContent.trim()).toBe("Hello");
  });

  it("renders params.html raw in .notification-content", () => {
    const { document } = render("notification", {
      html: '<a href="/">Link</a>',
    });
    expect(
      document.querySelector("div.notification .notification-content a"),
    ).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("notification", {
      text: "x",
      classes: "compact",
    });
    expect(document.querySelector("div.notification.compact")).toBeTruthy();
  });

  it("uses params.label when no heading is given", () => {
    const { document } = render("notification", {
      text: "x",
      label: "Status",
    });
    expect(document.querySelector("div.notification").getAttribute("aria-label"))
      .toBe("Status");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("notification", { text: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
