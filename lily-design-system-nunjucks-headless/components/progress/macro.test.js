import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("progress", () => {
  it("renders a <progress> with the base class", () => {
    const { document } = render("progress", { value: 50 });
    const el = document.querySelector("progress.progress");
    expect(el).toBeTruthy();
  });

  it("renders value and defaults max to 100", () => {
    const { document } = render("progress", { value: 40 });
    const el = document.querySelector("progress");
    expect(el.getAttribute("value")).toBe("40");
    expect(el.getAttribute("max")).toBe("100");
  });

  it("accepts a custom max", () => {
    const { document } = render("progress", { value: 3, max: 5 });
    const el = document.querySelector("progress");
    expect(el.getAttribute("value")).toBe("3");
    expect(el.getAttribute("max")).toBe("5");
  });

  it("accepts value=0", () => {
    const { document } = render("progress", { value: 0 });
    expect(document.querySelector("progress").getAttribute("value")).toBe("0");
  });

  it("omits value for indeterminate progress", () => {
    const { document } = render("progress", {});
    expect(document.querySelector("progress").hasAttribute("value")).toBe(false);
  });

  it("sets aria-label from params.label", () => {
    const { document } = render("progress", {
      value: 10,
      label: "Upload progress",
    });
    expect(document.querySelector("progress").getAttribute("aria-label"))
      .toBe("Upload progress");
  });

  it("prefers aria-labelledby over aria-label", () => {
    const { document } = render("progress", {
      value: 10,
      label: "Fallback",
      labelledBy: "h",
    });
    const el = document.querySelector("progress");
    expect(el.getAttribute("aria-labelledby")).toBe("h");
    expect(el.hasAttribute("aria-label")).toBe(false);
  });

  it("renders fallback text for value", () => {
    const { document } = render("progress", { value: 42 });
    expect(document.querySelector("progress").textContent).toContain("42%");
  });

  it("appends params.classes", () => {
    const { document } = render("progress", { value: 10, classes: "thin" });
    expect(document.querySelector("progress.progress.thin")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("progress", { value: 10 });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
