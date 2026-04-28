import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("contextual-help", () => {
  it("renders a wrapping <div> with the base class", () => {
    const { document } = render("contextual-help", {
      label: "Help",
    });
    expect(document.querySelector("div.contextual-help")).toBeTruthy();
  });

  it("renders a trigger button with the correct ARIA wiring", () => {
    const { document } = render("contextual-help", {
      id: "field-help",
      label: "Help",
    });
    const trigger = document.querySelector("button.contextual-help-trigger");
    expect(trigger).toBeTruthy();
    expect(trigger.getAttribute("type")).toBe("button");
    expect(trigger.getAttribute("aria-label")).toBe("Help");
    expect(trigger.getAttribute("aria-haspopup")).toBe("dialog");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(trigger.getAttribute("aria-controls")).toBe("field-help");
  });

  it("renders aria-expanded='true' when expanded is true", () => {
    const { document } = render("contextual-help", {
      label: "Help",
      expanded: true,
    });
    expect(document.querySelector(".contextual-help-trigger")
      .getAttribute("aria-expanded")).toBe("true");
  });

  it("renders the panel as role=dialog with the matching id", () => {
    const { document } = render("contextual-help", {
      id: "field-help",
      label: "Help",
    });
    const panel = document.querySelector(".contextual-help-panel");
    expect(panel).toBeTruthy();
    expect(panel.getAttribute("role")).toBe("dialog");
    expect(panel.getAttribute("id")).toBe("field-help");
  });

  it("hides the panel when expanded is false (default)", () => {
    const { document } = render("contextual-help", {
      label: "Help",
    });
    expect(document.querySelector(".contextual-help-panel")
      .hasAttribute("hidden")).toBe(true);
  });

  it("does not hide the panel when expanded is true", () => {
    const { document } = render("contextual-help", {
      label: "Help",
      expanded: true,
    });
    expect(document.querySelector(".contextual-help-panel")
      .hasAttribute("hidden")).toBe(false);
  });

  it("renders the panel raw html content", () => {
    const { document } = render("contextual-help", {
      label: "Help",
      expanded: true,
      html: "<p>Type your full legal name.</p>",
    });
    expect(document.querySelector(".contextual-help-panel p").textContent)
      .toBe("Type your full legal name.");
  });

  it("appends params.classes", () => {
    const { document } = render("contextual-help", {
      label: "Help",
      classes: "compact",
    });
    expect(document.querySelector("div.contextual-help.compact")).toBeTruthy();
  });

  it("renders params.attributes on the wrapper", () => {
    const { document } = render("contextual-help", {
      label: "Help",
      attributes: { "data-test": "x" },
    });
    expect(document.querySelector("div.contextual-help").getAttribute("data-test"))
      .toBe("x");
  });

  it("contains no <style> tag", () => {
    const { html } = render("contextual-help", { label: "Help" });
    expect(html).not.toContain("<style");
  });
});
