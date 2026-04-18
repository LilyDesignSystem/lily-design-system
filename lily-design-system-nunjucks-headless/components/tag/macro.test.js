import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("tag", () => {
  it("renders a <strong> with the base class", () => {
    const { document } = render("tag", { text: "Active" });
    const el = document.querySelector("strong");
    expect(el).toBeTruthy();
    expect(el.classList.contains("tag")).toBe(true);
    expect(el.textContent.trim()).toBe("Active");
  });

  it("escapes params.text", () => {
    const { document } = render("tag", { text: "A & B" });
    expect(document.querySelector("strong").textContent.trim()).toBe("A & B");
  });

  it("renders params.html raw", () => {
    const { document } = render("tag", { html: "<em>Beta</em>" });
    expect(document.querySelector("strong em")).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("tag", { text: "x", classes: "tag-red" });
    expect(document.querySelector("strong.tag.tag-red")).toBeTruthy();
  });

  it("sets aria-label from params.label", () => {
    const { document } = render("tag", { text: "NEW", label: "New item" });
    expect(document.querySelector("strong").getAttribute("aria-label"))
      .toBe("New item");
  });

  it("renders params.attributes", () => {
    const { document } = render("tag", {
      text: "x",
      attributes: { "data-state": "active" },
    });
    expect(document.querySelector("strong").getAttribute("data-state")).toBe("active");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("tag", { text: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
