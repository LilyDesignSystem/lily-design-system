import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("latvija-personas-kods-view", () => {
  it("renders a <span> with the base class", () => {
    const { document } = render("latvija-personas-kods-view", { value: "test-value" });
    const el = document.querySelector("span");
    expect(el).toBeTruthy();
    expect(el.classList.contains("latvija-personas-kods-view")).toBe(true);
  });

  it("renders the value as text content", () => {
    const { document } = render("latvija-personas-kods-view", { value: "test-value" });
    expect(document.querySelector("span").textContent).toBe("test-value");
  });

  it("sets aria-label from the label param", () => {
    const { document } = render("latvija-personas-kods-view", { value: "v", label: "lbl" });
    expect(document.querySelector("span").getAttribute("aria-label")).toBe("lbl");
  });

  it("appends params.classes", () => {
    const { document } = render("latvija-personas-kods-view", { value: "v", classes: "highlight" });
    expect(document.querySelector("span.latvija-personas-kods-view.highlight")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("latvija-personas-kods-view", { value: "v" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
