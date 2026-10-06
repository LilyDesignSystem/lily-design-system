import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("date-range", () => {
  it("renders a <fieldset> holding two date inputs, each with its own accessible name", () => {
    const { document } = render("date-range", {
      label: "Trip dates",
      startLabel: "Departure",
      endLabel: "Return",
      start: "2026-04-01",
      end: "2026-04-30",
    });
    const root = document.querySelector("fieldset.date-range");
    expect(root).toBeTruthy();
    expect(root.getAttribute("aria-label")).toBe("Trip dates");
    const inputs = document.querySelectorAll("input.date-input[type=date]");
    expect(inputs.length).toBe(2);
    expect(inputs[0].getAttribute("aria-label")).toBe("Departure");
    expect(inputs[0].getAttribute("value")).toBe("2026-04-01");
    expect(inputs[1].getAttribute("aria-label")).toBe("Return");
    expect(inputs[1].getAttribute("value")).toBe("2026-04-30");
  });

  it("emits names, id, classes and attributes only when given", () => {
    const { document } = render("date-range", { startName: "from", endName: "to", id: "r", classes: "x", attributes: { "data-k": "v" } });
    const root = document.querySelector("fieldset");
    expect(root.id).toBe("r");
    expect(root.classList.contains("x")).toBe(true);
    expect(root.getAttribute("data-k")).toBe("v");
    expect(root.hasAttribute("aria-label")).toBe(false);
    const [s, e] = document.querySelectorAll("input");
    expect(s.getAttribute("name")).toBe("from");
    expect(e.getAttribute("name")).toBe("to");
    expect(s.hasAttribute("value")).toBe(false);
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("date-range", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
