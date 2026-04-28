import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("status-light", () => {
  it("renders a <span> with the base class and role=status", () => {
    const { document } = render("status-light", {
      label: "Active",
    });
    const el = document.querySelector("span.status-light");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("status");
  });

  it("defaults variant to 'neutral'", () => {
    const { document } = render("status-light", {
      label: "Active",
    });
    expect(document.querySelector("span.status-light").getAttribute("data-variant"))
      .toBe("neutral");
  });

  it("respects a custom variant", () => {
    const { document } = render("status-light", {
      label: "Active",
      variant: "positive",
    });
    expect(document.querySelector("span.status-light").getAttribute("data-variant"))
      .toBe("positive");
  });

  it("renders the dot as aria-hidden", () => {
    const { document } = render("status-light", {
      label: "Active",
    });
    const dot = document.querySelector(".status-light-dot");
    expect(dot).toBeTruthy();
    expect(dot.getAttribute("aria-hidden")).toBe("true");
  });

  it("renders the label as the accessible text", () => {
    const { document } = render("status-light", {
      label: "Offline",
    });
    expect(document.querySelector(".status-light-label").textContent)
      .toBe("Offline");
  });

  it("appends params.classes", () => {
    const { document } = render("status-light", {
      label: "Active",
      classes: "small",
    });
    expect(document.querySelector("span.status-light.small")).toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render("status-light", {
      label: "Active",
      attributes: { "data-test": "x" },
    });
    expect(document.querySelector("span.status-light").getAttribute("data-test"))
      .toBe("x");
  });

  it("contains no <style> tag", () => {
    const { html } = render("status-light", { label: "Active" });
    expect(html).not.toContain("<style");
  });
});
