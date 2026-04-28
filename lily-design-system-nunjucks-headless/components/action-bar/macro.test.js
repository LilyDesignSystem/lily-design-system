import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("action-bar", () => {
  it("renders a <div> with the base class and role=toolbar", () => {
    const { document } = render("action-bar", {
      label: "Selection actions",
      selectedCount: 3,
      selectedCountLabel: "3 selected",
    });
    const el = document.querySelector("div.action-bar");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("toolbar");
    expect(el.getAttribute("aria-label")).toBe("Selection actions");
  });

  it("renders data-selected-count and selected count label", () => {
    const { document } = render("action-bar", {
      label: "Selection actions",
      selectedCount: 5,
      selectedCountLabel: "5 selected",
    });
    const el = document.querySelector("div.action-bar");
    expect(el.getAttribute("data-selected-count")).toBe("5");
    expect(document.querySelector(".action-bar-count").textContent)
      .toBe("5 selected");
  });

  it("renders a clear button when clearSelectionLabel is provided", () => {
    const { document } = render("action-bar", {
      label: "Selection actions",
      selectedCount: 1,
      selectedCountLabel: "1 selected",
      clearSelectionLabel: "Clear selection",
    });
    const btn = document.querySelector("button.action-bar-clear");
    expect(btn).toBeTruthy();
    expect(btn.getAttribute("type")).toBe("button");
    expect(btn.getAttribute("aria-label")).toBe("Clear selection");
  });

  it("omits the clear button when clearSelectionLabel is not provided", () => {
    const { document } = render("action-bar", {
      label: "Selection actions",
      selectedCount: 1,
      selectedCountLabel: "1 selected",
    });
    expect(document.querySelector("button.action-bar-clear")).toBeNull();
  });

  it("renders raw html content", () => {
    const { document } = render("action-bar", {
      label: "Selection actions",
      selectedCount: 2,
      selectedCountLabel: "2 selected",
      html: '<button class="action-bar-button" type="button" aria-label="Delete">Delete</button>',
    });
    expect(document.querySelector(".action-bar-button")).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("action-bar", {
      label: "Selection actions",
      selectedCount: 1,
      selectedCountLabel: "1 selected",
      classes: "extra",
    });
    expect(document.querySelector("div.action-bar.extra")).toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render("action-bar", {
      label: "Selection actions",
      selectedCount: 1,
      selectedCountLabel: "1 selected",
      attributes: { "data-test": "x" },
    });
    expect(document.querySelector("div.action-bar").getAttribute("data-test"))
      .toBe("x");
  });

  it("contains no <style> tag", () => {
    const { html } = render("action-bar", {
      label: "Selection actions",
      selectedCount: 0,
      selectedCountLabel: "0 selected",
    });
    expect(html).not.toContain("<style");
  });
});
