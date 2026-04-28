import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("tab-panel", () => {
  it("renders a <div> with the base class and role=tabpanel", () => {
    const { document } = render("tab-panel", {
      label: "Details",
      selected: true,
    });
    const el = document.querySelector("div.tab-panel");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("tabpanel");
  });

  it("uses aria-label when labelledBy is not provided", () => {
    const { document } = render("tab-panel", {
      label: "Details",
      selected: true,
    });
    const el = document.querySelector("div.tab-panel");
    expect(el.getAttribute("aria-label")).toBe("Details");
    expect(el.hasAttribute("aria-labelledby")).toBe(false);
  });

  it("uses aria-labelledby and omits aria-label when labelledBy is provided", () => {
    const { document } = render("tab-panel", {
      label: "Details",
      labelledBy: "tab-1",
      selected: true,
    });
    const el = document.querySelector("div.tab-panel");
    expect(el.getAttribute("aria-labelledby")).toBe("tab-1");
    expect(el.hasAttribute("aria-label")).toBe(false);
  });

  it("renders tabindex='0'", () => {
    const { document } = render("tab-panel", {
      label: "Details",
      selected: true,
    });
    expect(document.querySelector("div.tab-panel").getAttribute("tabindex"))
      .toBe("0");
  });

  it("renders hidden when selected is false (default)", () => {
    const { document } = render("tab-panel", {
      label: "Details",
    });
    expect(document.querySelector("div.tab-panel").hasAttribute("hidden"))
      .toBe(true);
  });

  it("does not render hidden when selected is true", () => {
    const { document } = render("tab-panel", {
      label: "Details",
      selected: true,
    });
    expect(document.querySelector("div.tab-panel").hasAttribute("hidden"))
      .toBe(false);
  });

  it("renders raw html content", () => {
    const { document } = render("tab-panel", {
      label: "Details",
      selected: true,
      html: "<p class='body'>hello</p>",
    });
    expect(document.querySelector("div.tab-panel .body").textContent).toBe("hello");
  });

  it("appends params.classes", () => {
    const { document } = render("tab-panel", {
      label: "Details",
      classes: "compact",
    });
    expect(document.querySelector("div.tab-panel.compact")).toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render("tab-panel", {
      label: "Details",
      attributes: { "data-test": "x" },
    });
    expect(document.querySelector("div.tab-panel").getAttribute("data-test"))
      .toBe("x");
  });

  it("contains no <style> tag", () => {
    const { html } = render("tab-panel", { label: "Details" });
    expect(html).not.toContain("<style");
  });
});
