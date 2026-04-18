import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("care-card", () => {
  it("renders a <div> with the base class and role=note", () => {
    const { document } = render("care-card", { text: "Body" });
    const el = document.querySelector("div.care-card");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("note");
  });

  it("defaults data-urgency to 'non-urgent'", () => {
    const { document } = render("care-card", { text: "x" });
    expect(document.querySelector("div.care-card").getAttribute("data-urgency"))
      .toBe("non-urgent");
  });

  it("respects a custom urgency", () => {
    const { document } = render("care-card", { text: "x", urgency: "urgent" });
    expect(document.querySelector("div.care-card").getAttribute("data-urgency"))
      .toBe("urgent");
  });

  it("accepts emergency urgency", () => {
    const { document } = render("care-card", { text: "x", urgency: "emergency" });
    expect(document.querySelector("div.care-card").getAttribute("data-urgency"))
      .toBe("emergency");
  });

  it("renders the heading at level 3 by default", () => {
    const { document } = render("care-card", {
      heading: "Get help",
      text: "x",
    });
    const h = document.querySelector("div.care-card h3.care-card-heading");
    expect(h).toBeTruthy();
    expect(h.textContent).toContain("Get help");
  });

  it("renders a visually-hidden screen-reader prefix when provided", () => {
    const { document } = render("care-card", {
      heading: "Get help",
      screenReaderPrefix: "Urgent advice:",
      urgency: "urgent",
    });
    const prefix = document.querySelector(
      "div.care-card h3 span.visually-hidden",
    );
    expect(prefix).toBeTruthy();
    expect(prefix.textContent).toContain("Urgent advice:");
  });

  it("renders params.text inside .care-card-body", () => {
    const { document } = render("care-card", { text: "Call 111" });
    const body = document.querySelector("div.care-card .care-card-body p");
    expect(body).toBeTruthy();
    expect(body.textContent.trim()).toBe("Call 111");
  });

  it("renders params.html raw inside .care-card-body", () => {
    const { document } = render("care-card", { html: "<ul><li>a</li></ul>" });
    expect(
      document.querySelector("div.care-card .care-card-body ul li"),
    ).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("care-card", { text: "x", classes: "narrow" });
    expect(document.querySelector("div.care-card.narrow")).toBeTruthy();
  });

  it("sets aria-label from params.label", () => {
    const { document } = render("care-card", { text: "x", label: "Care advice" });
    expect(document.querySelector("div.care-card").getAttribute("aria-label"))
      .toBe("Care advice");
  });

  it("renders caller block content inside .care-card-body", () => {
    const { document } = render("care-card", {}, "<p>Call</p>");
    expect(
      document.querySelector("div.care-card .care-card-body p").textContent,
    ).toBe("Call");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("care-card", { text: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
